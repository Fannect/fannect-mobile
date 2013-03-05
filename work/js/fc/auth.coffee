do ($ = window.jQuery, forge = window.forge, ko = window.ko, fc = window.fannect) ->
   fc.auth =
      _refresh_token: null
      _access_token: null
      _waitingFns: []
      _getting_access_token: false

      login: (email, pw, done) ->
         options =
            type: "POST"
            url: "#{fc.getLoginURL()}/v1/token"
            data: { email: email, password: pw }
            cache: false
            success: (user) ->
               user = JSON.parse(user)
               fc.auth._loginUser(user)
               fc.user.update(user)
               done(null, user)
            error: (err) ->
               if err.status == 401
                  fc.msg.show("Invalid username and password!")
                  done(null, false)
               else if (err?.status == 0 or err.statusText == "timeout")
                  fc.msg.loading("Server timeout! Retrying...")
                  fc.logger.sendError(err)
               else
                  fc.logger.sendError(err)
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
               fc.user.update(user)
               done()
            error: (err) ->
               done(err)

         forge.ajax(options)

      logout: (done) ->
         fc.auth._refresh_token = null
         fc.team._curr = null
         fc.user._curr = null
         forge.prefs.set "user_id", null
         forge.prefs.set "team_profile_id", null
         forge.prefs.set "twitter_active", null
         forge.prefs.set "refresh_token", null, fc.auth.redirectToLogin, fc.auth.redirectToLogin
        
         # Clear profile viewmodel
         fc.nav.getVM("profile-page")?.updateProfile({})

         if forge.is.mobile()
            forge.partners.parse.push.subscribedChannels (channels) ->
               forge.partners.parse.push.unsubscribe(channel) for channel in channels
                  
      hasAccessToken: () ->
         return fc.auth._access_token?

      getAccessToken: () ->
         throw new Error("Must request an access_token first.") unless fc.auth._access_token
         return fc.auth._access_token

      getNewAccessToken: (done) ->
         if fc.auth._getting_access_token
            console.log "Requesting: new access_token already being requested"
            return fc.auth._waitingFns.push(done)
         else
            console.log "Requesting: new access_token"
            fc.auth._getting_access_token = true
         
         fc.auth.getRefreshToken (err, token) ->
            return done(err) if err
         
            if not token
               fc.logger.sendLog("No refresh_token")
               console.log "No refresh_token"
               return fc.auth.logout()

            fc.auth._requestAccessToken token, false, (err, token) ->
               # Send done
               fc.auth._getting_access_token = false
               fn(null, token) for fn in fc.auth._waitingFns
               fc.auth._waitingFns.length = 0
               done(null, token)

      _requestAccessToken: (token, second_try, done) ->
         options =
            type: "POST"
            url: "#{fc.getLoginURL()}/v1/token/update"
            data: { refresh_token: token }
            success: (user) ->
               console.log "Success: new access_token"
               user = JSON.parse(user)
               fc.user.update(user)
               fc.auth._access_token = user.access_token
               
               done(null, fc.auth._access_token) if done
            error: (err) ->
               if err
                  if err?.status == 401 or err.statusCode?.toString() == "401"
                     console.log "Failed to get access_token (401): Invalid refresh_token"
                     fc.logger.sendLog("Failed to get access_token (401): Invalid refresh_token")
                     fc.auth.logout()
                  else if second_try
                     fc.msg.show("Failed to get a response from the server...")
                     console.log "Error: failed to get access_token", err
                     fc.auth.logout()
                  else
                     console.log "Error: failed to get access_token, retrying!", err
                     fc.auth._requestAccessToken(token, true, done)

         forge.ajax(options)

      getRefreshToken: (done) ->
         return done(null, fc.auth._refresh_token) if fc.auth._refresh_token 
         
         forge.prefs.get "refresh_token"
         , (refresh_token) ->
            if not refresh_token
               didRedirect = fc.auth.redirectToLogin()
               return done(null, false) if not didRedirect and done

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
            fc.nav.changeActiveHistory("none", transition: "slidedown", empty:true)
         else 
            return false
