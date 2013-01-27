do ($ = jQuery, ko = window.ko, fc = window.fannect) ->

   class fc.viewModels.Connect.ConnectProfile extends fc.viewModels.Profile
         # $.mobile.changePage "connect.html", { transition: "slideup" }
      changeUserImage: () ->
         return false #override function to disable changing other persons profile
      changeTeamImage: () -> 
         return false #override function to disable changing other persons profile

      rightButtonClick: () ->
         console.log "ADD TO ROSTER- FINISH"
         $.mobile.changePage "connect.html", transition: "slidedown"