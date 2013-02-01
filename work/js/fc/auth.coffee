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
               fc.user.update(user)
               done(null, user)
            error: (err) ->
               if err.status == 401
                  $.mobile.loading "show",
                     text: "Invalid username and password"
                     textonly: true
                     theme: "a"
                  setTimeout (() => $.mobile.loading "hide"), 1800
                  done(null, false)
               else
                  done(err)

         forge.ajax(options)

      _loginUser: (user) ->
         fc.auth._refresh_token = user.refresh_token
         fc.auth._access_token = user.access_token
         forge.prefs.set "refresh_token", user.refresh_token
         forge.prefs.set "user_id", user._id
         
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

      logout: (done) ->
         fc.auth._refresh_token = null
         fc.team._curr = null
         forge.prefs.set "refresh_token", null, fc.auth.redirectToLogin, fc.auth.redirectToLogin
         forge.prefs.set "user_id", null
         forge.prefs.set "team_profile_id", null

      hasAccessToken: () ->
         return fc.auth._access_token?

      getAccessToken: () ->
         throw new Error("Must request an access_token first.") unless fc.auth._access_token
         return fc.auth._access_token

      getNewAccessToken: (done) ->
         fc.auth.getRefreshToken (err, token) ->
            done(err) if err
            console.log "Requesting: new access_token"
            options =
               type: "PUT"
               url: "#{fc.getLoginURL()}/v1/token"
               data: { refresh_token: token }
               success: (data) ->
                  console.log "Success: new access_token"
                  data = JSON.parse data
                  fc.auth._access_token = data.access_token
                  done(null, fc.auth._access_token) if done
               error: (err) ->
                  if err
                     if err?.status == 401 or err.statusCode?.toString() == "401"
                        console.log "Failed to get access_token: Invalid refresh_token"
                        fc.auth.logout()
                     else
                        console.error "Error: failed to get access_token", err

            forge.ajax(options)

      getRefreshToken: (done) ->
         return done(null, fc.auth._refresh_token) if fc.auth._refresh_token 
         
         forge.prefs.get "refresh_token"
         , (refresh_token) ->
            if not refresh_token
               didRedirect = fc.auth.redirectToLogin() unless refresh_token
               done(null, false) unless didRedirect and done

            fc.auth._refresh_token = refresh_token
            done null, refresh_token

         , (error) ->
            done error

      isLoggedIn: (done) ->
         fc.auth.getRefreshToken (err, token) ->
            return done(err) if err and done
            done null, (token?.length > 0) if done

      redirectToLogin: () ->
         noAuth = [
            "index-page", 
            "createAccount-page", 
            "resetPassword-page", 
            "resetPassword-submitTemporary-page"
         ]
         
         if not ($.mobile.activePage.attr("id") in noAuth)
            $.mobile.changePage "index.html", transition: "slidedown"
         else 
            return false
