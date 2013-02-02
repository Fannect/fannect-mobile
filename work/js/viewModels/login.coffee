do ($ = jQuery, ko = window.ko, fc = window.fannect) ->

   class fc.viewModels.Login extends fc.viewModels.Base 
      constructor: () ->
         @email = ko.observable()
         @password = ko.observable()
         fc.setup()
         super

      login: () =>
         $.mobile.loading "show",
            text: "Logging In"
            textVisible: true
            theme: "a"

         fc.auth.login @email(), @password(), (err, success) =>
            $.mobile.loading "hide"
            if not err and success
               $.mobile.changePage "profile.html", transition: "slideup"

      onPageShow: () =>
         super
         fc.auth.isLoggedIn (err, is_logged_in) =>
            if is_logged_in
               $.mobile.changePage "profile.html", transition: "none"
            else
               forge.launchimage.hide() if forge.is.mobile()

      rightButtonClick: () =>
         $.mobile.changePage "createAccount.html", transition: "slide"
