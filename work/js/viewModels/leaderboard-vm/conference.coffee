do ($ = jQuery, ko = window.ko, fc = window.fannect) ->

   class fc.viewModels.Leaderboard.Conference extends fc.viewModels.Leaderboard.ListView

      getItemTemplate: () -> return "leaderboard-team-template"
      getListViewClass: () -> return "team-list"
      getUrl: (done) -> 
         fc.team.getActive (err, profile) ->
            done "#{fc.getResourceURL()}/v1/leaderboard/teams/#{profile.team_id}/conference"
      extractList: (data) -> data.teams