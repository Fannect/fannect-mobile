do ($ = window.jQuery, forge = window.forge, ko = window.ko, fc = window.fannect) ->
   fc.tutorial =
      show: () ->
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
               fc.tutorial.hide()

      hide: () ->
         $(".tutorial", $.mobile.activePage).fadeOut(400)