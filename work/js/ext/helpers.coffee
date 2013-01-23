do ($ = window.jQuery, forge = window.forge, ko = window.ko) ->
   currentPrefs = null
   showLoading = false
   cachedIsSlow = null

   fc = window.fannect = 
      viewModels: {}

   fc.setActiveMenu = (menu) ->
      if forge.is.web()
         $(".footer .ui-btn-active").removeClass("ui-btn-active").removeClass("ui-btn-persist")
         $(".footer ." + menu + "-menu").addClass("ui-btn-active").addClass("ui-btn-persist")
      else
         fc.mobile.setActiveMenu menu
         fc.mobile.setupHeader()

   fc.getResourceURL = () ->
      # return "http://192.168.0.21:2100"
      return if forge.is.web() then "http://localhost:2100" else "http://fannect-api.herokuapp.com"

   fc.getLoginURL = () ->
      return if forge.is.web() then "http://localhost:2200" else "https://fannect-login.herokuapp.com"

   fc.createPages = () ->
      for i, p of window.fannect.pages
         do (id = i, page = p) ->
            vm = null 
            scroller = null
            
            $("##{id}").live("pagecreate", () -> 

               # apply page classes
               if page.classes?
                  $page = $(@)
                  $page.addClass(c) for c in page.classes

               # create viewmodel and bind to page
               if page.vm?
                  vm = new page.vm()
                  ko.applyBindings vm, @
               
               # create page scrollers
               if page.scroller then scroller = $(".scrolling-text", @).scroller()
            
            ).live("pageshow", () ->
               if scroller then scroller.scroller("start")
               
               # add buttons to native header if mobile
               if forge.is.mobile() and page.buttons?.length > 0
                  for button in page.buttons
                     unless button.click
                        button.click = () ->
                           if button.position == "left" then vm.leftButtonClick()
                           else vm.rightButtonClick()
                     fc.mobile.addHeaderButton button

               vm.onPageShow() if vm

            ).live("pagebeforehide", () ->
               if scroller then scroller.scroller("stop")
               vm.onPageHide() if vm
            )
      return true

   fc.getParams = () ->
      return $.url().param() 

   fc.isSlow = () ->
      unless cachedIsSlow?
         result = new UAParser().getResult()
         cachedIsSlow = result.os.name == "Android" and parseFloat(result.os.version) < 3.0

      return cachedIsSlow

   fc.loading = (status) ->
      showLoading = status == "show"
      if showLoading
         $.mobile.loading "show",
            text: "Loading"
            textVisible: true
            theme: "b"
            html: ""
      else
         $.mobile.loading "hide"

   $(".ui-page").live "pageshow", () -> if showLoading then fc.loading "show"

   fc.ajax = (options, done) ->
      done = done or options.success
      options.success = (result) ->
         fc.loading "hide" unless options.hide_loading
         done null, JSON.parse(result)
      options.error = (error) ->
         fc.loading "hide" unless options.hide_loading
         if error?.statusCode == 401 then fc.redirectToLogin
         else done error

      # Append access_token on to querystring
      if options.url.indexOf("?") > 0
         options.url + "&access_token=#{fc.auth.getAccessToken}"
      else
         options.url + "?access_token=#{fc.auth.getAccessToken}"

      fc.loading "show" unless options.hide_loading
      forge.ajax(options)

   fc.clearBindings = (context) ->
      ko.cleanNode context

   fc.showTutorial = () ->
      $tutorial = $(".tutorial", $.mobile.activePage).fadeIn(400)
      
      unless $tutorial.data("tutorial_is_init")
         if $tutorial.children(".tutorial-slider.one").length < 1
            tutorial = $tutorial.get(0)
            slider = new Swipe(tutorial, speed: 500)
            $tutorial.data("tutorial_is_init", true)

            $(".tutorial-next", tutorial).click (e) ->
               e.stopPropagation()
               slider.next()
            $(".tutorial-prev", tutorial).click (e) ->
               e.stopPropagation()
               slider.prev()

         $(".tutorial-close", tutorial).click (e) ->
            e.stopPropagation()
            fc.hideTutorial()

   fc.hideTutorial = () ->
      $(".tutorial", $.mobile.activePage).fadeOut(400)

   fc.getDataURL = (file, max_width, max_height, done) ->
      canvas = document.createElement("canvas")
      context = canvas.getContext("2d")
      img = new Image()
      img.onload = () ->
         w = img.width
         h = img.height

         if w > h
            if w > max_width
               h *= max_width / w
               w = max_width
         else
            if h > max_height
               w *= max_height / h
               h = max_height

         context.drawImage(img, 0, 0, w, h)
         data = canvas.toDataURL()
         done null, data

      img.src = file


