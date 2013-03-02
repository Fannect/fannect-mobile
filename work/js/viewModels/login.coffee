do ($ = jQuery, ko = window.ko, fc = window.fannect) ->

   class fc.viewModels.Login extends fc.viewModels.Base 
      constructor: () ->
         @email = ko.observable()
         @password = ko.observable()
         fc.setup()
         super

      load: () =>
         fc.auth.isLoggedIn (err, loggedIn) =>
            if loggedIn
               if not fc.push.activate()
                  $.mobile.changePage "profile.html", transition: "none"
            else
               forge.launchimage.hide() if forge.is.mobile()


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

      rightButtonClick: () =>
         $.mobile.changePage "createAccount.html", transition: "slide"
