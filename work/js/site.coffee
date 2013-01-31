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
      
      forge.prefs.get "tutorialShown", (shown = []) ->
         if currentId in tutorial_pages and not (currentId in shown)
            shown.push currentId
            fc.tutorial.show()
            forge.prefs.set "tutorialShown", shown

   ).live "pageremove", () ->
      fc.clearBindings @

   $(".tutorial-link").live "click", (e) ->
      e.stopPropagation()
      fc.tutorial.show()
      return false
      
   getMenu = (page) ->
      return $(".header h1", page)?.first()?.attr("data-menu-root")

   setup = () ->
      $.mobile.allowCrossDomainPages = true
      $.mobile.loader.prototype.options.text = "Loading";
      $.mobile.loader.prototype.options.textVisible = true
      $.mobile.loader.prototype.options.theme = "b"
      $.mobile.loader.prototype.options.html = ""
      fc.mobile.createButtons()
      fc.createPages()

      if fc.isSlow() then $("html").addClass("speed-up")
      
      if forge.is.mobile()
         $("html").addClass("is-mobile")
         # Change reload stream to developers (for now)
         forge.reload.switchStream("developers-only")
      
      # Redirect to profile
      fc.auth.isLoggedIn (err, is_logged_in) ->
         if is_logged_in then $.mobile.changePage "profile.html", transition: "none"


      