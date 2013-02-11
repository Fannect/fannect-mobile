do ($ = jQuery, ko = window.ko, fc = window.fannect) ->

   class fc.viewModels.ResetPassword extends fc.viewModels.Base 
      constructor: () ->
         @email = ko.observable()
         super

      resetPassword: () =>
         if @email()

            fc.msg.loading("Resetting password...")

            fc.ajax
               url: "#{fc.getLoginURL()}/v1/reset"
               type: "POST"
               data: { email: @email() }
               no_access_token: true
            , (err, data) =>
               fc.msg.hide()

               if err
                  fc.msg.show("No account associated with: #{@email()}")
               else
                  fc.cache.set("reset_password_email", @email())
                  $.mobile.changePage "resetPassword-submitTemporary.html", fc.transition("slide")
         else
            fc.msg.show("We need an email to be able to reset your password silly!")