do ($ = jQuery, ko = window.ko, fc = window.fannect) ->

   class fc.viewModels.ResetPassword.SetPassword extends fc.viewModels.Base 
      constructor: () ->
         @password = ko.observable()
         @confirmPassword = ko.observable()
         super

      submitPassword: () =>
         if @password() and @password() == @confirmPassword()
            fc.msg.loading("Updating password...")

            fc.user.get (err, user) =>
               fc.ajax 
                  url: "#{fc.getLoginURL()}/v1/users/#{user._id}"
                  type: "PUT"
                  data: password: @password()
               , (err, result) =>
                  fc.msg.hide()
                  if err
                     fc.msg.show("Unable to update password. :(")
                  else
                     fc.auth._refresh_token = result.refresh_token
                     $.mobile.changePage "profile.html", transition: "slideup"
         else
            fc.msg.show("Your passwords don't match!")