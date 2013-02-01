do ($ = jQuery, ko = window.ko, fc = window.fannect) ->

   class fc.viewModels.ResetPassword.SetPassword extends fc.viewModels.Base 
      constructor: () ->
         @password = ko.observable()
         @confirmPassword = ko.observable()
         super

      linkFacebook: () =>
         if forge.is.mobile()
            # forge.facebook.authorize (
            #    (data) -> 
            #       console.log "FB Data: #{JSON.stringify(data)}"
            #       fc.team.redirectToSelect(hide_back: true)
            # ),(
            #    (err) -> 
            #       console.log "FB Err: #{JSON.stringify(err)}"
            # )