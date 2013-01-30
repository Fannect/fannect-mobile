do ($ = jQuery, ko = window.ko, fc = window.fannect) ->

   class fc.viewModels.ResetPassword extends fc.viewModels.Base 
      constructor: () ->
         @email = ko.observable()
         super

      resetPassword: () =>
         if @email()
            $.mobile.loading "show",
               text: "Resetting Password"
               textVisible: true
               theme: "a"

            fc.ajax
               url: "#{fc.getLoginURL()}/v1/reset"
               type: "POST"
               data: { email: @email() }
               no_access_token: true
            , (err, data) =>
               if err
                  $.mobile.loading "show",
                     text: "No account associated with this email"
                     textOnly: true
                     theme: "a"
               else
                  fc.cache.set("reset_password_email", @email())
                  $.mobile.changePage "resetPassword-submitTemporary.html", transition: "slide"