do ($ = jQuery, ko = window.ko, fc = window.fannect) ->

   class fc.viewModels.Profile.Shout extends fc.viewModels.Base 
      constructor: () ->
         super 
         @shout = ko.observable("")
         @chars_remaining = ko.computed () => 140 - @shout().length
         @twitter_active = ko.observable(false)

         @twitter_active.subscribe () =>
            forge.prefs.set "twitter_active", @twitter_active()
         
         forge.prefs.get "twitter_active", (val) =>
            @twitter_active(val)

      toggleTwitter: () => 
         @twitter_active(not @twitter_active())
         
         if @twitter_active()
            fc.user.get (err, user) =>
               if not user.twitter 
                  fc.user.linkTwitter (err, success) =>
                     @twitter_active(success)

      rightButtonClick: () =>
         if @chars_remaining() >= 0 and @chars_remaining() < 140
            fc.team.updateActive({shouts: [{_id: new Date(), text: @shout()}]})
            forge.flurry.customEvent("Shouting", {shouting: true})

            fc.team.getActive (err, profile) =>
               fc.ajax
                  url: "#{fc.getResourceURL()}/v1/me/teams/#{profile._id}/shouts"
                  type: "POST"
                  data: 
                     shout: @shout()
                     tweet: @twitter_active()
            
            $.mobile.changePage "profile.html", fc.transition("flip")

      onPageShow: () =>
         super
         fc.mobile.addHeaderButton {
            position: "right"
            text: "Shout It!"
            tint: [193, 39, 45, 160]
            click: @rightButtonClick
         }
