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
               done error, user

      update: (user) ->
         if not fc.user._curr then fc.user._curr = {}
         $.extend true, fc.user._curr, user
         sub fc.user._curr for sub in fc.user._subscribers

      save: (user) ->
         if user then fc.user.update user
         # implement saving

      subscribe: (cb) ->
         fc.user._subscribers.push cb if cb

      # possible options - menu, prev_page
      view: (profileId, options = {}) ->
         options.team_profile_id = profileId
         fc.cache.set "view_other", options
         $.mobile.changePage "profile-other.html", transition: "slide"

   $("#profile-other-page").live "pageshow", () ->
      if not options = fc.cache.pull("view_other")
         $.mobile.changePage "profile.html", transition: "none"
      else
         vm = new fc.viewModels.Profile.Other options.team_profile_id, () ->
            if forge.is.mobile() and not vm.is_friend()
               fc.mobile.addHeaderButton
                  position: "right"
                  text: "Add"
                  click: () -> vm.rightButtonClick()
         ko.applyBindings vm, @
         fc.mobile.addHeaderButton
            position: "left"
            type: "back"
            style: "back"
            text: "Back"