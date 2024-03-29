do ($ = window.jQuery, forge = window.forge, ko = window.ko, fc = window.fannect) ->
   
   fc.user =
      _curr: null
      _subscribers: []

      get: (done) ->
         if fc.user._curr 
            done null, fc.user._curr
         else
            if fc.auth._getting_access_token
               fc.auth.getNewAccessToken (err) ->
                  return if err
                  done null, fc.user._curr
            else
               fc.ajax 
                  url: "#{fc.getResourceURL()}/v1/me"
                  type: "GET"
               , (error, user) ->
                  fc.user.update(user)
                  done error, user

      update: (user) ->
         if not fc.user._curr then fc.user._curr = {}
         fc.auth._refresh_token = user.refresh_token if user.refresh_token

         if user._id != fc.user._curr?._id
            fc.user._addToChannel(user._id) 
            
            demographics = { user_id: user._id }
            demographics.gender = "m" if user.gender?[0].toLowerCase() == "m"
            demographics.gender = "f" if user.gender?[0].toLowerCase() == "f"

            # Try and parse birthday
            try
               if user.birthday
                  year = 3.15569e10
                  now = new Date() / 1
                  birth = new Date(user.birthday) / 1
                  demographics.age = Math.floor((now - birth) / year)
            catch e
               console.log("Failed to set age: #{JSON.stringify(e)}")
             
            forge.flurry.setDemographics(demographics)

         fc.user._curr = {} unless fc.user._curr

         $.extend fc.user._curr, user
         fc.user.updateInvites(user.invites)
         fc.user._notify()

         # Change stream
         if forge.is.mobile() and user?.reload_stream
            forge.reload.switchStream(user?.reload_stream or "default")

         sub fc.user._curr for sub in fc.user._subscribers

      updateInvites: (invites) ->
         if not fc.user._curr then fc.user._curr = {}
         fc.user._curr.invites = invites
         forge.notification.setBadgeNumber(fc.user._curr.invites?.length or 0)
         fc.user._notify()

      subscribe: (cb) -> fc.user._subscribers.push cb if cb
      _notify: () -> sub(fc.user._curr) for sub in fc.user._subscribers

      linkTwitter: (done) ->
         fc.user.get (err, user) ->
            if not forge.is.mobile() or user.twitter 
               done(null, true) if done
               return

            link = () ->
               forge.tabs.openWithOptions
                  url: "#{fc.getLoginURL()}/v1/twitter?access_token=#{fc.auth.getAccessToken()}"
                  pattern: "*://*/v1/twitter/done*"
                  title: "Link Twitter"
               , (data) ->
                  if data?.url?.indexOf("status=success") >= 0 #and not data.userCancelled
                     fc.user.update({ twitter: true })
                     done(null, true) if done
                  else
                     done(null, false) if done
                  
            if fc.auth.hasAccessToken() then link()
            else fc.auth.getNewAccessToken (err, token) ->
               if err then done() if done
               else link()

      unlinkTwitter: (done) ->
         fc.msg.loading("Unlinking Twitter account...")
         fc.ajax
            url: "#{fc.getLoginURL()}/v1/twitter/delete"
            type: "POST"
            data: "delete": true
         , (err, data) ->
            fc.msg.hide()
            return done() if err
            fc.msg.show("Twitter account has been unlinked")
            fc.user.update(twitter: false)
            forge.prefs.set "twitter_active", false
            done(null, true)

      linkInstagram: (done) ->
         fc.user.get (err, user) ->
            if not forge.is.mobile() or user.instagram 
               done() if done
               return

            link = () ->
               forge.tabs.openWithOptions
                  url: "#{fc.getLoginURL()}/v1/instagram?access_token=#{fc.auth.getAccessToken()}"
                  pattern: "*://*/v1/instagram/done*"
                  title: "Link Instagram"
               , (data) ->
                  if data?.url?.indexOf("status=success") >= 0
                     fc.user.update(instagram: true)
                     done(null, true) if done
                  else
                     done(null, false) if done
                  
            if fc.auth.hasAccessToken() then link()
            else fc.auth.getNewAccessToken (err, token) ->
               if err then done() if done
               else link()

      unlinkInstagram: (done) ->
         fc.msg.loading("Unlinking Instagram account...")
         fc.ajax
            url: "#{fc.getLoginURL()}/v1/instagram/delete"
            type: "POST"
            data: "delete": true
         , (err, data) ->
            fc.msg.hide()
            return done() if err
            fc.msg.show("Instagram account has been unlinked")
            fc.user.update(instagram: false)
            done(null, true)

      linkFacebook: (done) ->
         fc.user.get (err, user) ->
            if not forge.is.mobile() or user?.facebook?.linked 
               done() if done
               return

            permissions = [ "user_location", "user_birthday", "publish_actions" ]
            forge.facebook.authorize permissions
            , (data) ->
               if user.facebook == true or user.facebook?.linked
                  fc.user.update({facebook: {linked: true, access_token: data.access_token} })
                  return done(null, true)

               fc.ajax
                  url: "#{fc.getLoginURL()}/v1/facebook"
                  type: "POST"
                  data: { facebook_access_token: data.access_token }
               , (err, result) ->
                  if result?.status == "success"
                     fc.user.update({facebook: {linked: true, access_token: data.access_token} })
                     done(null, true) if done
                  else
                     done(null, false) if done
            , (err) ->
               done(null, false) if err

      unlinkFacebook: (done) ->
         fc.msg.loading("Unlinking Facebook account...")
         fc.ajax
            url: "#{fc.getLoginURL()}/v1/facebook/delete"
            type: "POST"
            data: "delete": true
         , (err, data) ->
            fc.msg.hide()
            return done() if err
            fc.user.update(facebook: false)
            done(null, true)

      getFacebookAccessToken: (done) ->
         fc.user.get (err, user) ->
            return done(err) if err
            if user.facebook?.access_token
               done null, user.facebook?.access_token
            else
               fc.user.linkFacebook (err, result) ->
                  return done(err) if err
                  return done(null, user.facebook?.access_token or false)

      _addToChannel: (user_id) ->
         if forge.is.mobile()
            forge.partners.parse.push.subscribedChannels (channels) ->
               channel = "user_#{user_id}"
               if not (channel in channels)
                  forge.partners.parse.push.subscribe(channel)
