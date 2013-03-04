do ($ = window.jQuery, forge = window.forge, ko = window.ko, fc = window.fannect) ->
   
   fc.user =
      _curr: null
      _subscribers: []

      get: (done) ->
         if fc.user._curr 
            done null, fc.user._curr
         else
            fc.ajax 
               url: "#{fc.getResourceURL()}/v1/me"
               type: "GET"
            , (error, user) ->
               fc.user._curr = user
               fc.user._addToChannel(user._id)

               done error, user

      update: (user) ->
         if not fc.user._curr then fc.user._curr = {}
         fc.auth._refresh_token = user.refresh_token if user.refresh_token

         if user._id != fc.user._curr?._id
            fc.user._addToChannel(user._id) 
            forge.flurry.setDemographics(user_id: user._id)

         $.extend true, fc.user._curr, user
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
               done() if done
               return

            link = () ->
               forge.tabs.openWithOptions
                  url: "#{fc.getLoginURL()}/v1/twitter?access_token=#{fc.auth.getAccessToken()}"
                  pattern: "*://*/v1/twitter/done*"
                  title: "Link Twitter"
               , (data) ->
                  if data.url.indexOf("status=success") >= 0 #and not data.userCancelled
                     fc.user.update(twitter: true)
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

      _addToChannel: (user_id) ->
         if forge.is.mobile()
            forge.partners.parse.push.subscribedChannels (channels) ->
               channel = "user_#{user_id}"
               if not (channel in channels)
                  forge.partners.parse.push.subscribe(channel)
