do ($ = window.jQuery, forge = window.forge, ko = window.ko) ->
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
      # "http://fannect-api.herokuapp.com"
      # return "http://192.168.0.21:2100"
      return if forge.is.web() then "http://localhost:2100" else "http://fannect-api.herokuapp.com"

   fc.getLoginURL = () ->
      # "https://fannect-login.herokuapp.com"
      return if forge.is.web() then "http://localhost:2200" else "https://fannect-login.herokuapp.com"

   fc.createPages = () ->
      for i, p of window.fannect.pages
         do (id = i, page = p) ->
            vm = null 
            scroller = null
            $page = null
            
            $("##{id}").live("pageinit", () -> 

               # apply page classes
               $page = $(@)
               if page.classes?
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
                        if button.position == "left"
                           button.click = vm.leftButtonClick
                        else 
                           button.click = vm.rightButtonClick
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

   fc.clearBindings = (context) ->
      ko.cleanNode context

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


