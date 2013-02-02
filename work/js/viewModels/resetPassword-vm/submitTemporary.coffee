do ($ = jQuery, ko = window.ko, fc = window.fannect) ->

   class fc.viewModels.ResetPassword.SubmitTemporary extends fc.viewModels.Base 
      constructor: () ->
         @password = ko.observable()
         super

      submitTemporary: () =>
         if @password() and @password().length > 0
            fc.msg.loading("Submitting...")

            fc.ajax
               url: "#{fc.getLoginURL()}/v1/token"
               type: "POST"
               data: 
                  email: fc.cache.pull("reset_password_email")
                  password: @password()
               no_access_token: true
            , (err, user) ->
               console.log "err", err
               console.log "user", user
               fc.msg.hide()
               if err
                  fc.msg.show("Unexpected failure.. :(")
               else
                  fc.user.update(user)
                  $.mobile.changePage "resetPassword-setPassword.html", transition: "slide"
         else
            fc.msg.show("Please insert the code emailed to you!")

      onPageShow: () =>
         super
         unless fc.cache.hasKey("reset_password_email")
            $.mobile.changePage "index.html", transition: "none"
            