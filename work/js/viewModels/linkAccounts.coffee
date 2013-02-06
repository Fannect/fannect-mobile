do ($ = jQuery, ko = window.ko, fc = window.fannect) ->

   class fc.viewModels.LinkAccounts extends fc.viewModels.Base 
      
      linkTwitter: () =>
         if fc.auth.hasAccessToken()
            fc.user.linkTwitter () ->
               fc.team.redirectToSelect(hide_back: true)
         else
            fc.msg.show("Unable to access Twitter login servers!")

      skip: () => fc.team.redirectToSelect(hide_back: true)