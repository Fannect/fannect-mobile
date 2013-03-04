do ($ = jQuery, ko = window.ko, fc = window.fannect) ->

   class fc.viewModels.CreateAccount extends fc.viewModels.Base 
      constructor: () ->
         @first_name = ko.observable("")
         @last_name = ko.observable("")
         @email = ko.observable()
         @password = ko.observable()
         @confirm_password = ko.observable()
         super

      createAccount: () =>
         
         if not (@first_name() and @last_name() and @email() and @password())
            return fc.msg.show("All fields are required!")

         if @password() != @confirm_password()
            return fc.msg.show("Passwords don't match silly!")
         
         fc.msg.loading("Creating account...")

         fc.auth.createAccount
            first_name: @first_name()
            last_name: @last_name()
            email: @email()
            password: @password()
         , (err) =>
            fc.msg.hide()

            if err?.status == 409
               fc.msg.show("#{@email()} already registered!")
            else if err
               fc.msg.show("Failed to create an account...")
               fc.logger.sendError(err)
            else
               $.mobile.changePage "linkAccounts.html", transition:"slide"