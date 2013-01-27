do ($ = window.jQuery, forge = window.forge, ko = window.ko, fc = window.fannect) ->
   fc.team =
      _teams: {}
      _curr: null
      _subscribers: []

      get: (team_profile_id, done) ->
         if fc.team._teams[team_profile_id] 
            done null, fc.team._teams[team_profile_id] 
         else
            fc.ajax 
               url: "#{fc.getResourceURL()}/v1/me/teams/#{team_profile_id}"
               type: "GET"
            , (err, team) ->
               return done err if err
               fc.team._teams[team_profile_id] = team
               fc.team._notify(team)
               done null, team

      getActiveId: () -> fc.team._curr
      getActive: (done) ->
         if fc.team.getActiveId()
            fc.team.get(fc.team._curr, done) 
         else
            forge.prefs.get "team_profile_id"     
            , (team_profile_id) ->
               if team_profile_id
                  fc.team._curr = team_profile_id
                  fc.team.get fc.team._curr, done
               else
                  done null, null
            , (err) -> throw err

      setActive: (team_profile_id, cache, done) ->
         if arguments < 3
            done = cache
            cache = false

         # Run functions in parallel so this tracks which are finished
         caching_finished = not cache
         setting_finished = false

         fc.team._curr = team_profile_id
         forge.prefs.set "team_profile_id", team_profile_id,
            (err) -> done(err) if done
            (success) -> 
               if caching_finished then done() if done
               else setting_finished = true
         fc.team.get team_profile_id, (err, team_profile) ->
            if setting_finished then done err, team_profile
            else caching_finished = true

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
      _notify: (team) -> sub team for sub in fc.team._subscribers

