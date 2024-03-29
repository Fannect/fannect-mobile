do ($ = jQuery, ko = window.ko, fc = window.fannect) ->

   class fc.viewModels.Leaderboard.League extends fc.viewModels.Leaderboard.ListView

      getItemTemplate: () -> return "leaderboard-team-template"
      getListViewClass: () -> return "team-list"
      getUrl: (done) -> 
         fc.team.getActive (err, profile) ->
            if profile.is_college
               done "#{fc.getResourceURL()}/v1/leaderboard/teams/#{profile.team_id}/conference"
            else
               done "#{fc.getResourceURL()}/v1/leaderboard/teams/#{profile.team_id}/league"
      extractList: (data) -> return data.teams