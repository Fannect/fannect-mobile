do ($ = window.jQuery, forge = window.forge, ko = window.ko, fc = window.fannect) ->
   fc.team =
      _teams: {}
      _curr: null
      _subscribers: []
      _waitingFn: {}
      _fetching: {}

      get: (teamProfileId, done) ->

         if fc.team._teams[teamProfileId] 
            fc.team._notify(fc.team._teams[teamProfileId])
            done(null, fc.team._teams[teamProfileId]) if done
            return fc.team._teams[teamProfileId]
         else
            fc.team.refresh(teamProfileId, done)

      refresh: (teamProfileId, done) ->
         if fc.team._fetching[teamProfileId]
            console.log "Already being pulled"
            if done
               fc.team._waitingFn[teamProfileId] = [] unless fc.team._waitingFn[teamProfileId]
               fc.team._waitingFn[teamProfileId].push(done) 
         else
            fc.team._fetching[teamProfileId] = true
            fc.ajax 
               url: "#{fc.getResourceURL()}/v1/me/teams/#{teamProfileId}"
               type: "GET"
               retry: "forever"
            , (err, team) ->
               fc.team._addToChannel(team.team_id)
               fc.team._teams[teamProfileId] = team
               fc.team._notify(team)
               fc.team._waitingFn[teamProfileId]
               fc.team._doneFetching(teamProfileId, team)
               done(null, team) if done

      refreshActive: (done) ->
         fc.team.getActive (err, profile) ->
            fc.team.refresh(profile._id, done) if profile

      _doneFetching: (teamProfileId, team) ->
         fc.team._fetching[teamProfileId] = false
         if fc.team._waitingFn[teamProfileId]?.length > 0
            d(null, team) for d in fc.team._waitingFn[teamProfileId]
            fc.team._waitingFn[teamProfileId].length = 0

      getActive: (done) ->
         if fc.team._curr
            fc.team.get(fc.team._curr, done) 
         else
            forge.prefs.get "team_profile_id"     
            , (teamProfileId) ->
               if teamProfileId
                  fc.team._curr = teamProfileId
                  fc.team.get(fc.team._curr, done)
               else
                  fc.team.redirectToSelect(no_back: true)
                  done() if done
            , (err) -> done(err)

      setActive: (teamProfileId, done) ->
         fc.team._curr = teamProfileId
         forge.prefs.set "team_profile_id", teamProfileId
         fc.team.get teamProfileId, done

      updateActive: (update) ->
         throw "Cannot update team before it has been fetched" unless fc.team._curr
         $.extend true, fc.team._teams[fc.team._curr], update
         fc.team._notify(fc.team._teams[fc.team._curr])

      create: (team_id, done) ->
         forge.flurry.customEvent("Create Profile", {team_id: team_id})
         fc.ajax 
            url: "#{fc.getResourceURL()}/v1/me/teams"
            type: "POST"
            data: team_id: team_id
         , (err, team) ->
            return done(err) if err and done
            fc.team._addToChannel(team_id)
            fc.team._teams[team._id] = team
            fc.team.setActive team._id, false
            fc.team._notify(team)
            done(null, team) if done

      clearCache: () ->
         fc.team._teams = {}

      remove: (teamProfileId, done) ->
         fc.team._teams[teamProfileId] = null

         if teamProfileId == fc.team._curr
            fc.team._curr = null
            forge.prefs.set "team_profile_id", null
         
         fc.ajax 
            url: "#{fc.getResourceURL()}/v1/me/teams/#{teamProfileId}/delete"
            type: "POST"
            data: "delete": true
         , (err, data) ->
            return done(err, data) if err and done
            done(err, data) if done

      removeFromChannel: (team_id) -> forge.partners.parse.push.unsubscribe("team_#{team_id}") if forge.is.mobile()
      subscribe: (cb) -> fc.team._subscribers.push cb if cb
      _notify: (team) -> sub team for sub in fc.team._subscribers

      # options - hide_back: [false]
      redirectToSelect: (options) ->
         # check if profiles already exist
         fc.ajax 
            url: "#{fc.getResourceURL()}/v1/me/teams"
            type: "GET"
            retry: "forever"
         , (error, teams) =>
            if teams.length > 0
               fc.team.setActive teams[0]._id, () ->
                  $.mobile.changePage "profile.html", fc.transition("slidedown")
            else
               fc.cache.set("choose_team_options", { hide_back: true })
               $.mobile.changePage "profile-selectTeam-chooseSport.html", transition: ("slide" or options.transition)

      _addToChannel: (team_id) ->
         if forge.is.mobile()
            forge.partners.parse.push.subscribedChannels (channels) ->
               channel = "team_#{team_id}"
               if not (channel in channels)
                  forge.partners.parse.push.subscribe(channel)
