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
               # Change stream
               if forge.is.mobile()
                  forge.reload.switchStream(user?.reload_stream or "default")

               done error, user

      update: (user) ->
         if not fc.user._curr then fc.user._curr = {}
         fc.auth._refresh_token = user.refresh_token if user.refresh_token
         fc.user._addToChannel(user._id) if user._id != fc.user._curr?._id

         $.extend true, fc.user._curr, user
         fc.user.updateInvites(user.invites)
         fc.user._notify()

         sub fc.user._curr for sub in fc.user._subscribers

      updateInvites: (invites) ->
         if not fc.user._curr then fc.user._curr = {}
         fc.user.invites = invites
         forge.notification.setBadgeNumber(fc.user._curr.invites?.length or 0)

      subscribe: (cb) -> fc.user._subscribers.push cb if cb
      _notify: () -> sub(fc.user._curr) for sub in fc.user._subscribers

      linkTwitter: (done) ->
         fc.user.get (err, user) ->
            if not forge.is.mobile() or user.twitter 
               done() if done
               return

            link = () ->
               forge.tabs.openWithOptions
                  url: "#{fc.getLoginURL()}/twitter?access_token=#{fc.auth.getAccessToken()}"
                  pattern: "#{fc.getLoginURL()}/twitter/success"
                  title: "Link Twitter"
               , (data) ->
                  if data.url = "#{fc.getLoginURL()}/twitter/success"
                     fc.user.update(twitter: true)
                     done(null, true) if done
                  else
                     done() if done
               
            if fc.auth.hasAccessToken() then link()
            else fc.auth.getNewAccessToken (err, token) ->
               if err then done() if done
               else link()

      unlinkTwitter: (done) ->
         fc.ajax
            url: "#{fc.getLoginURL()}/twitter"
            type: "DELETE"
         , (err, data) ->
            return done() if err
            fc.user.update(twitter: false)
            forge.prefs.set "twitter_active", false
            done(null, true)

      _addToChannel: (user_id) ->
         if forge.is.mobile()
            forge.partners.parse.push.subscribedChannels (channels) ->
               channel = "user_#{user_id}"
               if not (channel in channels)
                  forge.partners.parse.push.subscribe(channel)

      view: (options) ->
         fc.cache.set "view_other", options
         $.mobile.changePage "profile-other.html", transition: "slide"

   $("#profile-other-page").live("pageinit", () ->
      $(@).addClass("no-padding")
   ).live("pageshow", () ->
      if not options = fc.cache.pull("view_other")
         $.mobile.changePage "profile.html", transition: "none"
      else
         vm = new fc.viewModels.Profile.Other options
         ko.applyBindings vm, @
         fc.mobile.addHeaderButton
            position: "left"
            type: "back"
            style: "back"
            text: "Back"
   )