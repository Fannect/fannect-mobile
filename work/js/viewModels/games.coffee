do ($ = jQuery, ko = window.ko, fc = window.fannect) ->
   
   class fc.viewModels.Games extends fc.viewModels.Base 
      constructor: () ->
         super

      showShare: () ->
         $("#lockedMessage").popup("close", transition:"none")
         setTimeout (-> $.mobile.changePage "share.html", transition: "slidedown"), 20
         return false



