do ($ = window.jQuery, fc = window.fannect, forge = window.forge) ->

   $(document).ready () ->
      setup()

   $(".tutorial-link").live "click", (e) ->
      e.stopPropagation()
      fc.tutorial.show()
      return false

   setup = () ->

      # disable all transitions for better faster Android experience
      $.mobile.pushStateEnabled = false
      $.mobile.transitionFallbacks.slide = "none"
      $.mobile.transitionFallbacks.slidein = "none"
      $.mobile.transitionFallbacks.slideout = "none"
      $.mobile.transitionFallbacks.slideupin = "none"
      $.mobile.transitionFallbacks.slideout = "none"
      $.mobile.transitionFallbacks.flip = "none"
      $.mobile.transitionFallbacks.flipin = "none"
      $.mobile.transitionFallbacks.flipout = "none"
      $.mobile.transitionFallbacks.slidedown = "none"
      $.mobile.transitionFallbacks.slidefade = "none"
      $.mobile.transitionFallbacks.slideup = "none"
      $.mobile.transitionFallbacks.flow = "none"
      $.mobile.transitionFallbacks.turn = "none"
      
      if forge.is.mobile()
         $("html").addClass("is-mobile")

         forge.reload.updateReady.addListener () ->
            dialog = $(".updatePopup", $.mobile.activePage).first()
            text = "An Auto-Update is available! Minimize and reopen the app! No need to go to the #{if forge.is.ios() then 'App' else 'Play'} Store. These changes may be subtle."
            $("h3.ui-title", dialog).text(text)
            dialog.popup("open")

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
         # stub out flurry for web
         forge.flurry =
            customEvent: () -> 
            setDemographics: () -> 
            setLocation: () -> 
            startTimedEvent: () ->
            endTimedEvent: () ->


      fc.nav.setup()
      fc.mobile.createButtons()

      if fc.isSlow() 
         $("html").addClass("speed-up")
         $.mobile.defaultPageTransition = "none"

      fc.push.setup()

      # force page removal of first page from DOM
      $(document).bind "pagechange.firstpageremove", (toPage, info) ->
         if ($.mobile.firstPage and info.options.fromPage and ($.mobile.firstPage == info.options.fromPage))
            $.mobile.firstPage.remove()

            # We only need to remove 1 time from DOM, so unbind the unused event
            $(document).unbind("pagechange.firstpageremove")
        

      