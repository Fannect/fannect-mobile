do ($ = jQuery, ko = window.ko, fc = window.fannect) ->
   
   class fc.viewModels.Games.GamedayPics extends fc.viewModels.Games.PhotoBase 
      constructor: () ->
         super
         @game_type("gameday_pics")
