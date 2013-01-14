do ($ = window.jQuery, fc = window.fannect, forge = window.forge) ->

   $(document).ready () ->
      setup()

   $(".ui-page").live("pagecreate", () ->
      if forge.is.mobile()
         $("body").addClass("is-mobile")
         # Hide header and footer
         $(".header", @).removeAttr("data-role data-position data-tap-toggle").css(display: "none")
         $(".footer", @).removeAttr("data-role data-position data-tap-toggle").css(display: "none")


   ).live("pagebeforeshow", () ->
      # check if logged in
      # unless fc.auth.checkLogin() then return
   
      fc.setActiveMenu getMenu @

   ).live("pageshow", () ->
      tutorial_pages = [ "profile-page", "games-attendanceStreak-page", "games-gameFace-page", "games-guessTheScore-page" ]
      currentId = $($.mobile.activePage).attr("id")
      
      forge.prefs.get "tutorialShown", (shown) ->
        shown = shown or []
         if currentId in tutorial_pages and not (currentId in shown)
            shown.push currentId
            fc.showTutorial()
            forge.prefs.set "tutorialShown", shown

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
      $.mobile.loader.prototype.options.text = "Loading Page";
      $.mobile.loader.prototype.options.textVisible = true
      $.mobile.loader.prototype.options.theme = "b"
      $.mobile.loader.prototype.options.html = ""
      fc.mobile.createButtons()

      if fc.isSlow() then $("body").addClass("speed-up")