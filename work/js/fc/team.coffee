do ($ = window.jQuery, forge = window.forge, ko = window.ko, fc = window.fannect) ->

   teamUpdatedSubscribers = []
   activeChangedSubscribers = []
   waitingFn = {}
   fetching = {}

   doneFetching = (teamProfileId, team) ->
      fetching[teamProfileId] = false
      if waitingFn[teamProfileId]?.length > 0
         d(null, team) for d in waitingFn[teamProfileId]
         waitingFn[teamProfileId].length = 0

   notifyTeamUpdated = (team) -> 
      for sub in teamUpdatedSubscribers
          sub(team) if sub
   notifyActiveChanged = (profile) -> 
      for sub in activeChangedSubscribers
         sub(profile) if sub 

   addToChannel = (team_id) ->
      if forge.is.mobile()
         forge.partners.parse.push.subscribedChannels (channels) ->
            channel = "team_#{team_id}"
            if not (channel in channels)
               forge.partners.parse.push.subscribe(channel)

   fc.team =
      _teams: {}
      _curr: null

      get: (teamProfileId, done) ->
         if fc.team._teams[teamProfileId] 
            done(null, fc.team._teams[teamProfileId]) if done
            return fc.team._teams[teamProfileId]
         else
            fc.team.refresh(teamProfileId, done)

      refresh: (teamProfileId, done) ->
         if fetching[teamProfileId]
            console.log "Already being pulled"
            if done
               waitingFn[teamProfileId] = [] unless waitingFn[teamProfileId]
               waitingFn[teamProfileId].push(done) 
         else
            fetching[teamProfileId] = true
            fc.ajax 
               url: "#{fc.getResourceURL()}/v1/me/teams/#{teamProfileId}"
               type: "GET"
               retry: "forever"
            , (err, team) ->
               # Redirect to select team if 404 
               if err?.status == 404 or err?.statusCode?.toString() == "404"
                  return fc.team.redirectToSelect() 
               
               addToChannel(team.team_id)
               fc.team._teams[teamProfileId] = team
               notifyTeamUpdated(team) if fc.team._curr == team._id
               waitingFn[teamProfileId]
               doneFetching(teamProfileId, team)
               done(null, team) if done

      refreshActive: (done) ->
         fc.team.getActive (err, profile) ->
            fc.team.refresh(profile._id, done) if profile

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
                  fc.team.redirectToSelect(no_back: true, done)
            , (err) -> done(err)

      setActive: (teamProfileId, done) ->
         if fc.team._curr != teamProfileId
            fc.team._curr = teamProfileId
            console.log "CHANGING PROFILE TO:", teamProfileId
            forge.prefs.set "team_profile_id", teamProfileId
            fc.team.get teamProfileId, (err, profile) ->
               notifyActiveChanged(profile)
               notifyTeamUpdated(profile)
               console.log "RETRIEVED PROFILE FROM:", teamProfileId
               console.log "PROFILE", profile
               done(null, profile)
         else
            fc.team.getActive(done)

      updateActive: (update) ->
         throw "Cannot update team before it has been fetched" unless fc.team._curr
         $.extend true, fc.team._teams[fc.team._curr], update
         notifyTeamUpdated(fc.team._teams[fc.team._curr])

      create: (team_id, done) ->
         forge.flurry.customEvent("Create Profile", {team_id: team_id})
         fc.ajax 
            url: "#{fc.getResourceURL()}/v1/me/teams"
            type: "POST"
            data: team_id: team_id
         , (err, team) ->
            return done(err) if err and done
            fc.team._teams[team._id] = team
            fc.team.setActive team._id, false
            notifyTeamUpdated(team)
            addToChannel(team_id)
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
      onTeamUpdated: (cb) -> teamUpdatedSubscribers.push cb if cb
      
      # options - hide_back: [false]
      redirectToSelect: (options, done) ->
         # check if profiles already exist
         fc.ajax 
            url: "#{fc.getResourceURL()}/v1/me/teams"
            type: "GET"
            retry: "forever"
         , (error, teams) =>
            if teams.length > 0
               fc.team.setActive teams[0]._id, () ->
                  fc.team.getActive(done) if done
                  $.mobile.changePage "profile.html", transition: "slidedown"
            else
               fc.cache.set("choose_team_options", { hide_back: true })
               $.mobile.changePage "profile-selectTeam-chooseSport.html", transition: ("slide" or options.transition)

      onActiveChanged: (cb) -> activeChangedSubscribers.push(cb)
      
  

