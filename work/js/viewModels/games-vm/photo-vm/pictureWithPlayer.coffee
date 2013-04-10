do ($ = jQuery, ko = window.ko, fc = window.fannect) ->
   
   class fc.viewModels.Games.PictureWithPlayer extends fc.viewModels.Games.PhotoBase 
      constructor: () ->
         super
         @game_type("picture_with_player")
