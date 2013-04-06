do ($ = jQuery, ko = window.ko, fc = window.fannect) ->
   
   class fc.viewModels.Games.SpiritWear extends fc.viewModels.Games.PhotoBase 
      constructor: () ->
         super
         @game_type("spirit_wear")
