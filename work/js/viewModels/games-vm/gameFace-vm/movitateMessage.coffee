do ($ = jQuery, ko = window.ko, fc = window.fannect) ->
   
   DEFAULT_MESSAGE = "Get your head in the game!"

   class fc.viewModels.Games.GameFace.MotivateMessage extends fc.viewModels.Base 
      constructor: () ->
         super 
         @selected_fans = fc.cache.set "motivate_ids"

         if not (@selected_fans?.length > 0)
            return $.mobile.changePage "games-gameFace.html", fc.transition: "none"
         
         @message = ko.observable(DEFAULT_MESSAGE)
         @chars_remaining = ko.computed () => 100 - @message().length
         
      rightButtonClick: () =>
         if @chars_remaining() >= 0 and @chars_remaining() < 140
            fc.logger.flurry("Motivating")
            
      onPageShow: () =>
         super
         fc.mobile.addHeaderButton {
            position: "right"
            text: "Motivate!"
            tint: [193, 39, 45, 160]
            click: @rightButtonClick
         }
