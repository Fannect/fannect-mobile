do ($ = window.jQuery, forge = window.forge, ko = window.ko) ->
   currentUser = null
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
      return if forge.is.web() then "http://localhost:2100" else "http://fannect.herokuapp.com"

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
            text: "Loading Page"
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
      get: (done) ->
         if currentUser 
            done null, currentUser
         else
            fc.ajax 
               url: "#{fc.getResourceURL()}/me"
               type: "GET"
            , (error, data) ->
               currentUser = data
               done error, data

      update: (user) ->
         $.extend true, currentUser, user

      save: (user) ->
         if user then fc.user.update user
         # implement saving

   fc.auth =
      login: (email, pw, done) ->
         query = { email: email, password: pw }
         $.mobile.loading "show"
         $.post "#{fc.getResourceURL()}/api/login", query, (data, status) ->
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
         fc.mobile._addButton 0, "Profile", "images/mobile/Icon_TabBar_Profile@2x.png", "profile.html"
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


