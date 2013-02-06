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
         
         fc.user.get (err, user) ->
            if not user.twitter 
               fc.user.linkTwitter (err, success) =>
                  @twitter_active(success)

      rightButtonClick: () =>
         if @chars_remaining() >= 0 and @chars_remaining() < 140
            fc.team.updateActive({shouts: [{text: @shout()}]})
            history.back()

            fc.team.getActive (err, profile) =>
               fc.ajax
                  url: "#{fc.getResourceURL()}/v1/me/teams/#{profile._id}/shouts"
                  type: "POST"
                  data: 
                     shout: @shout()
                     tweet: @twitter_active()
            
      onPageShow: () =>
          super

      # load: (done) ->

         # fc.ajax 
         #    url: "#{fc.getResourceURL()}/v1/me/teams"
         #    type: "GET"
         # , (error, teams) =>
         #    @is_loading(false)
         #    if teams.length > 0
         #       @teams.push team for team in teams
         #    else 
         #       fc.cache.set("no_team_profile", true)
         #       $.mobile.changePage "profile-selectTeam-chooseSport.html", transition: "slide"

      # selectTeam: (data) ->
      #    fc.team.setActive data._id, (err) ->
      #       $.mobile.changePage "profile.html", transition: "slideup"

      # rightButtonClick: () ->
      #    $.mobile.changePage "profile-selectTeam-chooseSport.html", transition: "slide"
