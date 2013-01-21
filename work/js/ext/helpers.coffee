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
         fc.setHeader()

   fc.setHeader = () ->
      if forge.is.mobile()
         forge.topbar.removeButtons()
         header = $(".header", $.mobile.activePage).get(0)
         forge.topbar.setTitle $("h1", header).text()

         leftButton = $("a[data-rel=back]", header)

         if leftButton.length > 0
            forge.topbar.addButton
               text: leftButton.text()
               position: "left"
               type: "back"
               style: "back"

   fc.getResourceURL = () ->
      return "http://192.168.0.21:2100"
      # return if forge.is.web() then "http://localhost:2100" else "http://fannect-api.herokuapp.com"

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

   fc.user =
      _curr: null
      _subscribers: []
      get: (done) ->
         if fc.user._curr 
            done null, fc.user._curr
         else
            fc.ajax 
               url: "#{fc.getResourceURL()}/v1/me"
               type: "GET"
            , (error, data) ->
               fc.user._curr = data
               done error, data

      update: (user) ->
         $.extend true, fc.user._curr, user
         sub fc.user._curr for sub in fc.user._subscribers

      save: (user) ->
         if user then fc.user.update user
         # implement saving

      subscribe: (cb) ->
         fc.user._subscribers.push cb if cb

   fc.auth =
      login: (email, pw, done) ->
         query = { email: email, password: pw }
         $.mobile.loading "show"
         $.post "#{fc.getResourceURL()}/v1/login", query, (data, status) ->
            $.mobile.loading "hide"
            if data.status == "success" then done()
            else done data.error_message
      
      isLoggedIn: (cb) ->
         forge.get "refresh_token", cb
         
      redirectToLogin: () ->
         noAuth = ["index-page", "createAccount-page"]
         if not ($.mobile.activePage.id in noAuth)
            $.mobile.changePage "index.html", transition: "slidedown"

   fc.mobile =
      _buttons: {}
      _waiting_to_activate: null
      _addButton: (index, text, image, target) ->
         forge.tabbar.addButton
            icon: image,
            text: text,
            index: index
         , (button) ->
            name = text.toLowerCase()
            fc.mobile._buttons[name] = button
            
            if fc.mobile._waiting_to_activate == name
               button.setActive()
               fc.mobile._waiting_to_activate = null

            button.onPressed.addListener () ->
               $.mobile.changePage target, transition: "none"
         
      createButtons: () ->
         fc.mobile._addButton 0, "Profile", "images/mobile/Icon_TabBar_Profile.png", "profile.html"
         fc.mobile._addButton 1, "Games", "images/mobile/Icon_TabBar_Points@2x.png", "games.html"
         fc.mobile._addButton 2, "Leaderboard", "images/mobile/Icon_TabBar_Leaderboard@2x.png", "leaderboard.html"
         fc.mobile._addButton 3, "Connect", "images/mobile/Icon_TabBar_Connect@2x.png", "connect.html"
         
      setActiveMenu: (name) ->
         if name
            name = name.toLowerCase()
            forge.tabbar.show()
            
            if fc.mobile._buttons[name] then fc.mobile._buttons[name].setActive()
            else fc.mobile._waiting_to_activate = name

         else
            forge.tabbar.hide()

      addHeaderButton: (options, click) ->
         if forge.is.mobile()
            cb = cb or options.click
            forge.topbar.addButton options, cb


