do ($ = jQuery, ko = window.ko, fc = window.fannect) ->
   
   class fc.viewModels.Games.PhotoChallenge extends fc.viewModels.Games.PhotoBase 
      constructor: () ->
         super
         @game_type = "photo_challenge"
