do ($ = jQuery, ko = window.ko, fc = window.fannect) ->

   class fc.viewModels.ResetPassword.SetPassword extends fc.viewModels.Base 
      constructor: () ->
         @password = ko.observable()
         @confirmPassword = ko.observable()
         super

      load: () =>
         @password("")
         @confirmPassword("")

      submitPassword: () =>
         if @password() and @password() == @confirmPassword()
            fc.msg.loading("Updating password...")

            fc.user.get (err, user) =>
               fc.ajax 
                  url: "#{fc.getLoginURL()}/v1/users/#{user._id}/update"
                  type: "POST"
                  data: password: @password()
               , (err, result) =>
                  fc.msg.hide()
                  if err
                     fc.msg.show("Unable to update password. :(")
                  else
                     fc.auth._refresh_token = result.refresh_token
                     forge.prefs.set "refresh_token", result.refresh_token
                     fc.nav.changeActiveHistory("profile", transition: "slideup")
         else
            fc.msg.show("Your passwords don't match!")
