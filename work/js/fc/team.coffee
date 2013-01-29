do ($ = window.jQuery, forge = window.forge, ko = window.ko, fc = window.fannect) ->
   fc.team =
      _teams: {}
      _curr: null
      _subscribers: []
      _waitingFn: {}
      _fetching: {}

      get: (teamProfileId, done) ->
         if fc.team._teams[teamProfileId] 
            done(null, fc.team._teams[teamProfileId]) if done
            fc.team._notify(fc.team._teams[teamProfileId])
            return fc.team._teams[teamProfileId]
         else
            if done and fc.team._fetching[teamProfileId]
               fc.team._waitingFn[teamProfileId] = [] unless fc.team._waitingFn[teamProfileId]
               fc.team._waitingFn[teamProfileId].push(done) 
            else
               fc.team._fetching[teamProfileId] = true
               fc.ajax 
                  url: "#{fc.getResourceURL()}/v1/me/teams/#{teamProfileId}"
                  type: "GET"
               , (err, team) ->
                  throw err if err
                  fc.team._teams[teamProfileId] = team
                  fc.team._notify(team)
                  fc.team._waitingFn[teamProfileId]
                  fc.team._doneFetching(teamProfileId, team)
                  done(null, team) if done

      _doneFetching: (teamProfileId, team) ->
         fc.team._fetching[teamProfileId] = false
         if fc.team._waitingFn[teamProfileId]?.length > 0
            d(null, team) for d in fc.team._waitingFn[teamProfileId]

      getActive: (done) ->
         if fc.team._curr
            fc.team.get(fc.team._curr, done) 
         else
            forge.prefs.get "team_profile_id"     
            , (teamProfileId) ->
               console.log "ProfileID: #{teamProfileId}"
               if teamProfileId
                  fc.team._curr = teamProfileId
                  fc.team.get(fc.team._curr, done)
               else
                  fc.team.redirectToSelect(no_back: true)
                  done(null, null) if done
            , (err) -> throw err

      setActive: (teamProfileId, done) ->
         fc.team._curr = teamProfileId
         forge.prefs.set "team_profile_id", teamProfileId
         fc.team.get teamProfileId, done

      create: (team_id, done) ->
         fc.ajax 
            url: "#{fc.getResourceURL()}/v1/me/teams"
            type: "POST"
            data: team_id: team_id
         , (err, team) ->
            return next(err) if err
            fc.team._teams[team._id] = team
            fc.team.setActive team._id, false
            fc.team._notify(team)
            done(null, team) if done

      update: (update) ->
         if not team = fc.team._teams[update._id or fc.team._curr]
            throw "Cannot update a team (#{team_profile._id}) that has not been fetched"
         
         $.extend true, team, update
         fc.team._notify(team)

      save: (team_profile) ->
         if team_profile then fc.team.update team_profile
         # implement saving

      subscribe: (cb) -> fc.team._subscribers.push cb if cb
      _notify: (team) -> 
         sub team for sub in fc.team._subscribers

      # options - hide_back: [false]
      redirectToSelect: (options) ->
         # check if profiles already exist
         fc.ajax 
            url: "#{fc.getResourceURL()}/v1/me/teams"
            type: "GET"
         , (error, teams) =>
            console.log "HI THERE"
            if teams.length > 0
               fc.team.setActive teams[0]._id, () ->
                  $.mobile.changePage "profile.html", transition: "slidedown"
            else
               fc.cache.set("choose_team_options", { hide_back: true })
               $.mobile.changePage "profile-selectTeam-chooseSport.html", transition: ("slide" or options.transition)


         # $.mobile.changePage "profile-selectTeam.html", transition: ("slide" or options.transition) 

   # $("#profile-selectTeam-page").live("pageinit", () ->
   #    $(@).addClass("dark-background")
   #    vm = new fc.viewModels.Profile.SelectTeam() 
   #    ko.applyBindings vm, @
   # ).live("pageshow", () ->
   #    options = fc.cache.pull("select_team_options") or {}
   #    unless options.hide_back
   #       fc.mobile.addHeaderButton
   #          position: "left"
   #          type: "back"
   #          style: "back"
   #          text: "Back"
   # )
