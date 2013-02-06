do ($ = jQuery, ko = window.ko, fc = window.fannect) ->

   class fc.viewModels.CreateAccount extends fc.viewModels.Base 
      constructor: () ->
         @first_name = ko.observable()
         @last_name = ko.observable()
         @email = ko.observable()
         @password = ko.observable()
         @confirm_password = ko.observable()
         super

      createAccount: () =>
         fc.msg.loading("Creating accout...")

         fc.auth.createAccount
            first_name: @first_name()
            last_name: @last_name()
            email: @email()
            password: @password()
         , (err) =>
            if err?.status == 409
               fc.msg.show("#{@email()} already registered!")
            else
               fc.msg.hide()
               $.mobile.changePage "linkAccounts.html", transition: "slide"
         return false