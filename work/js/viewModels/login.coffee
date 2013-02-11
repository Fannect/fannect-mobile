do ($ = jQuery, ko = window.ko, fc = window.fannect) ->

   class fc.viewModels.Login extends fc.viewModels.Base 
      constructor: () ->
         @email = ko.observable()
         @password = ko.observable()
         fc.setup()
         super

      login: () =>
         if @email()?.length > 1 and @password()?.length > 1
            fc.msg.loading("Logging in...")
            fc.auth.login @email(), @password(), (err, success) =>
               fc.msg.hide()
               if not err and success
                  $.mobile.changePage "profile.html", fc.transition("slideup")
               else
                  fc.msg.show("Incorrect username or password!")
         else
            fc.msg.show("We need your email and password to log you in!")

      onPageShow: () =>
         super
         fc.auth.isLoggedIn (err, is_logged_in) =>
            if is_logged_in
               $.mobile.changePage "profile.html", fc.transition("none")
            else
               forge.launchimage.hide() if forge.is.mobile()

      rightButtonClick: () =>
         $.mobile.changePage "createAccount.html", fc.transition("slide")
