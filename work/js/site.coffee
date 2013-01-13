do ($ = window.jQuery, fc = window.fannect, forge = window.forge) ->

   $(document).on "mobileinit", () ->
      setup()

   $(".ui-page").live("pagecreate", () ->
      if forge.is.mobile()
         $("body").addClass("is-mobile")
         $(".header", @).removeAttr("data-role data-position data-tap-toggle").css(display: "none")
         $(".footer", @).removeAttr("data-role data-position data-tap-toggle").css(display: "none")
      # $(".footer", @).css 
      #    display: "none"
      #    paddingTop: "0"
      #    paddingBottom: "0"

   ).live("pagebeforeshow", () ->
      # check if logged in
      # unless fc.auth.checkLogin() then return
   
      fc.setActiveMenu getMenu @

   ).live("pageshow", () ->
      tutorial_pages = [ "profile-page", "games-attendanceStreak-page", "games-gameFace-page", "games-guessTheScore-page" ]
      currentId = $($.mobile.activePage).attr("id")
      cookie = fc.cookie.get()
      cookie.tutorialShown = cookie.tutorialShown or []

      if currentId in tutorial_pages and not (currentId in cookie.tutorialShown)
         cookie.tutorialShown.push currentId
         fc.showTutorial()
         fc.cookie.save cookie

   ).live "pageremove", () ->
      fc.clearBindings @

   $(".tutorial-link").live "click", (e) ->
      e.stopPropagation()
      fc.showTutorial()
      return false
      
   getMenu = (page) ->
      return $(".header h1", page)?.first()?.attr("data-menu-root")

   setup = () ->
      $.mobile.allowCrossDomainPages = true
      $.mobile.loader.prototype.options.text = "loading";
      $.mobile.loader.prototype.options.textVisible = true
      $.mobile.loader.prototype.options.theme = "b"
      $.mobile.loader.prototype.options.html = ""
      fc.mobile.createButtons()

      if $.support.touch and not $.support.touchOverflow
         $("body").addClass("speed-up")

      if forge.is.android()
         forge.event.backPressed.addListener () ->
            history.back()