do ($ = jQuery, ko = window.ko, fc = window.fannect) ->

   class fc.viewModels.LinkAccounts extends fc.viewModels.Base 
      
      linkTwitter: () =>
         if fc.auth.hasAccessToken()
            fc.user.linkTwitter (err,success) ->
               if success
                  $.mobile.changePage "profile-selectTeam-chooseSport.html?hide_back=true", transition:"slide"
         else
            fc.msg.show("Unable to access Twitter login servers!")