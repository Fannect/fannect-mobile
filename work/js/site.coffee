do ($ = window.jQuery, fc = window.fannect, forge = window.forge) ->

   $(document).ready () ->
      setup()

   $(".ui-page").live("pagecreate", () ->
      if forge.is.mobile()
         # Hide header and footer
         $(".header", @).removeAttr("data-role data-position data-tap-toggle").css(display: "none")
         $(".footer", @).removeAttr("data-role data-position data-tap-toggle").css(display: "none")

   ).live("pagebeforeshow", () ->
      # check if logged in
      if $.mobile.activePage.attr("id") != "index-page"
         fc.auth.isLoggedIn()

      fc.setActiveMenu getMenu @

   ).live("pageshow", () ->
      tutorial_pages = [ 
         "profile-page", 
         "games-attendanceStreak-page", 
         "games-gameFace-page", 
         "games-guessTheScore-page" 
      ]
      
      currentId = $.mobile.activePage.attr("id")
      
      forge.prefs.get "tutorial_shown", (shown = []) ->
         if currentId in tutorial_pages and not (currentId in shown)
            shown.push currentId
            fc.tutorial.show()
            forge.prefs.set "tutorial_shown", shown

   ).live "pageremove", () ->
      fc.clearBindings @

   $(".tutorial-link").live "click", (e) ->
      e.stopPropagation()
      fc.tutorial.show()
      return false
      
   getMenu = (page) ->
      return $(".header h1", page)?.first()?.attr("data-menu-root")

   setup = () ->
      if forge.is.mobile()
         $("html").addClass("is-mobile")
      else
         console.log "HIT"
         # fake flurry for web
         forge.flurry =
            customEvent: () -> 
            setDemographics: () -> 
            setLocation: () -> 
            startTimedEvent: () ->
            endTimedEvent: () ->

      fc.createPages()
      fc.mobile.createButtons()
      if fc.isSlow() then $("html").addClass("speed-up")




      