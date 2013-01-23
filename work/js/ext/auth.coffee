do ($ = window.jQuery, forge = window.forge, ko = window.ko) ->
   fc.auth =
      _refresh_token: null
      _access_token: null

      login: (email, pw, done) ->
         options =
            type: "POST"
            url: "#{fc.getLoginURL()}/v1/token"
            data: { email: email, password: pw }
            success: (user) ->
               fc.auth._refresh_token = user.refresh_token
               fc.auth._access_token = user.access_token
               forge.prefs.set "refresh_token", user.refresh_token
               fc.user.update user
               done(null, user)
            error: (err) ->
               done err

         forge.ajax(options)

      hasAccessToken: () ->
         return fc.auth._access_token?

      getAccessToken: () ->
         throw new Error("Must request an access_token first.") unless fc.auth._access_token
         return fc.auth._access_token

      getNewAccessToken: (done) ->
         fc.auth.getRefreshToken (err, token) ->
            done(err) if err

            options =
               type: "PUT"
               url: "#{fc.getLoginURL()}/v1/token"
               data: { access_token: token }
               success: (data) ->
                  fc.auth._access_token = data.access_token
                  done(null, fc.auth._access_token)
               error: (err) ->
                  done err

            forge.ajax(options)

      getRefreshToken: (done) ->
         return done(null, fc.auth._refresh_token) if fc.auth._refresh_token 

         forge.prefs.get "refresh_token"
         , (refresh_token) ->
            return fc.auth.redirectToLogin() unless refresh_token
            fc.auth._refresh_token = refresh_token
            done null, refresh_token

         , (error) ->
            done error

      isLoggedIn: (done) ->
         fc.auth.getRefreshToken (err, token) ->
            return done(err) if err
            done null, token

      redirectToLogin: () ->
         noAuth = ["index-page", "createAccount-page"]
         if not ($.mobile.activePage.id in noAuth)
            $.mobile.changePage "index.html", transition: "slidedown"
