do ($ = jQuery, ko = window.ko, fc = window.fannect) ->

   class fc.viewModels.ResetPassword.SetPassword extends fc.viewModels.Base 
      constructor: () ->
         @password = ko.observable()
         @confirmPassword = ko.observable()
         super

      submitPassword: () =>
         if @password() and @password() == @confirmPassword()
            $.mobile.loading "show",
               text: "Updating password"
               textVisible: true
               theme: "a"

            fc.user.get (err, user) =>
               fc.ajax 
                  url: "#{fc.getLoginURL()}/v1/users/#{user._id}"
                  type: "PUT"
                  data: password: @password()
               , (err, result) =>
                  $.mobile.loading "show",
                  if err
                     #handle
                  else
                     fc.auth._refresh_token = result.refresh_token
                     $.mobile.changePage "profile.html", transition: "slideup"
