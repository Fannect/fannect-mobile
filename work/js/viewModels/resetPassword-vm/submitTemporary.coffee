do ($ = jQuery, ko = window.ko, fc = window.fannect) ->

   class fc.viewModels.ResetPassword.SubmitTemporary extends fc.viewModels.Base 
      constructor: () ->
         @password = ko.observable()
         super

      submitTemporary: () =>
         if @password() and @password().length > 0
            $.mobile.loading "show",
               text: "Submitting"
               textVisible: true
               theme: "a"

            fc.ajax
               url: "#{fc.getLoginURL()}/v1/token"
               type: "POST"
               data: 
                  email: fc.cache.pull("reset_password_email")
                  password: @password()
               no_access_token: true
            , (err, user) ->
               $.mobile.loading "hide"
               if err
                  # FAILED
               else
                  fc.user.update(user)
                  $.mobile.changePage "resetPassword-setPassword.html", transition: "slide"
                  
      onPageShow: () =>
         super
         unless fc.cache.hasKey("reset_password_email")
            $.mobile.changePage "index.html", transition: "none"
            