do ($ = jQuery, ko = window.ko, fc = window.fannect) ->

   class fc.viewModels.Login extends fc.viewModels.Base 
      constructor: () ->
         @email = ko.observable()
         @password = ko.observable()
         super

      login: () =>
         fc.auth.login @email(), @password(), (error) =>
            unless error
               $.mobile.changePage "profile.html", transition: "slideup"

         return false

      onPageShow: () =>
         super
         fc.auth.isLoggedIn (err, is_logged_in) ->
            if is_logged_in
               $.mobile.changePage "profile.html", transition: "none"

      rightButtonClick: () =>
         $.mobile.changePage "createAccount.html", transition: "slide"
