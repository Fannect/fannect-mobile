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
      $.mobile.pushStateEnabled = false
      $.mobile.transitionFallbacks.slideout = "none"
      
      if forge.is.mobile()
         $("html").addClass("is-mobile")

         forge.reload.updateReady.addListener () ->
            $(".updatePopup", $.mobile.activePage).popup("open")

         if forge.is.android()
            $("html").addClass("android")
            forge.event.backPressed.addListener (close) -> 
               if $.mobile.activePage.attr("id") == "profile-page"
                  close()
               else 
                  $.mobile.back()
            forge.event.backPressed.preventDefault()
         else if forge.is.ios() 
            $("html").addClass("ios")
      else
         # fake flurry for web
         forge.flurry =
            customEvent: () -> 
            setDemographics: () -> 
            setLocation: () -> 
            startTimedEvent: () ->
            endTimedEvent: () ->

      fc.createPages()
      fc.mobile.createButtons()
      if fc.isSlow() 
         $("html").addClass("speed-up")
         $.mobile.defaultPageTransition = "none"



      