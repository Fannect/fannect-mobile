do ($ = window.jQuery, forge = window.forge, ko = window.ko, fc = window.fannect) ->
   fc.auth =
      _refresh_token: null
      _access_token: null

      login: (email, pw, done) ->
         options =
            type: "POST"
            url: "#{fc.getLoginURL()}/v1/token"
            data: { email: email, password: pw }
            success: (user) ->
               user = JSON.parse(user)
               fc.auth._loginUser(user)
               done(null, user)
            error: (err) ->
               done(err)

         forge.ajax(options)

      _loginUser: (user) ->
         fc.auth._refresh_token = user.refresh_token
         fc.auth._access_token = user.access_token
         forge.prefs.set "refresh_token", user.refresh_token
         fc.user.update user
         
      createAccount: (user, done) ->
         options = 
            type: "POST"
            url: "#{fc.getLoginURL()}/v1/users"
            data: user
            success: (user) ->
               user = JSON.parse(user)
               fc.auth._loginUser(user)
               done()
            error: (err) ->
               done(err)

         forge.ajax(options)

      signout: (done) ->
         fc.auth._refresh_token = null
         forge.prefs.set "refresh_token", null, fc.auth.redirectToLogin, fc.auth.redirectToLogin

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
               data: { refresh_token: token }
               success: (data) ->
                  data = JSON.parse data
                  fc.auth._access_token = data.access_token
                  done(null, fc.auth._access_token) if done
               error: (err) ->
                  resp = JSON.parse(err.responseText)
                  if resp.reason == "invalid_argument" then fc.auth.signout()
                  done(err)

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
            done null, (token?) if done

      redirectToLogin: () ->
         noAuth = ["index-page", "createAccount-page"]
         if not ($.mobile.activePage.attr("id") in noAuth)
            $.mobile.changePage "index.html", transition: "slidedown"
