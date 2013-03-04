do ($ = jQuery, ko = window.ko, fc = window.fannect) ->

   class fc.viewModels.ResetPassword.SubmitTemporary extends fc.viewModels.Base 
      constructor: () ->
         @password = ko.observable()
         super

      load: () =>
         @password("")

      submitTemporary: () =>
         if @password() and @password().length > 0
            fc.msg.loading("Submitting...")

            fc.ajax
               url: "#{fc.getLoginURL()}/v1/token"
               type: "POST"
               data: 
                  email: @params.email
                  password: @password()
               no_access_token: true
            , (err, user) =>
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
         unless @params.email
            fc.nav.changeActiveHistory("none", empty: true)