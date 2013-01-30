do ($ = jQuery, ko = window.ko, fc = window.fannect) ->

   class fc.viewModels.Login extends fc.viewModels.Base 
      constructor: () ->
         @email = ko.observable()
         @password = ko.observable()
         @signing_in = ko.observable(false)
         super

      login: () =>
         @signing_in(true)
         $.mobile.loading "show",
            text: "Logging In"
            textVisible: true
            theme: "a"

         fc.auth.login @email(), @password(), (error) =>
            $.mobile.loading "hide"
            @signing_in(false)
            unless error
               $.mobile.changePage "profile.html", transition: "slideup"
         return false

      onPageShow: () =>
         super
         fc.auth.isLoggedIn (err, is_logged_in) =>
            $.mobile.loading "show",
                  text: "#{@email()} already registered!"
                  textonly: true
                  theme: "a"
               setTimeout (() => $.mobile.loading "hide"), 1800

            if is_logged_in
               $.mobile.changePage "profile.html", transition: "none"

      rightButtonClick: () =>
         $.mobile.changePage "createAccount.html", transition: "slide"
