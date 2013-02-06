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

               # Change stream
               if forge.is.mobile()
                  forge.reload.switchStream(user?.reload_stream or "default")

               done error, user

      update: (user) ->
         if not fc.user._curr then fc.user._curr = {}
         fc.auth._refresh_token = user.refresh_token if user.refresh_token
         $.extend true, fc.user._curr, user
         sub fc.user._curr for sub in fc.user._subscribers

      clearCache: () ->
         fc.user._curr = null

      linkTwitter: (done) ->
         fc.user.get (err, user) ->
            if forge.is.mobile() and not user.twitter
               forge.tabs.openWithOptions
                  url: "#{fc.getLoginURL()}/twitter?access_token=#{fc.auth.getAccessToken()}"
                  pattern: "#{fc.getLoginURL()}/twitter/success"
                  title: "Link Twitter"
               , (data) ->
                  if data.url = "#{fc.getLoginURL()}/twitter/success"
                     fc.user._curr.twitter = true
                     done(null, true) if done
                  else
                     data()
            else
               done()


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