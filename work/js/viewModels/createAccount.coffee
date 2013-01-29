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
         fc.auth.createAccount
            first_name: @first_name()
            last_name: @last_name()
            email: @email()
            password: @password()
         , (err) ->
            fc.team.redirectToSelect(hide_back: true)
         return false