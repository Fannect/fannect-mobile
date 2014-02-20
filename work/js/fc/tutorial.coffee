do ($ = window.jQuery, forge = window.forge, ko = window.ko, fc = window.fannect) ->
   fc.tutorial =

      autoShow: () ->
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

      show: () ->
         $tutorial = $(".tutorial", $.mobile.activePage)
         console.log "TUTORIAL: #{JSON.stringify($tutorial)}"
         # Hide if tutorial is already visible
         return $tutorial.fadeOut(400) if $tutorial.is(":visible")
         $tutorial.fadeIn(400)

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

            $(".tutorial-close, .tutorial-done", tutorial).click (e) ->
               e.stopPropagation()
               fc.tutorial.hide()

      hide: () ->
         $(".tutorial", $.mobile.activePage).fadeOut(400)
