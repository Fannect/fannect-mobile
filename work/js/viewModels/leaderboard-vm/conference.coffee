do ($ = jQuery, ko = window.ko, fc = window.fannect) ->

   class fc.viewModels.Leaderboard.Conference extends fc.viewModels.Leaderboard.TeamList

      getUrl: () -> "#{fc.getResourceURL()}/v1/leaderboard/teams/#{fc.team.getActiveTeamId()}/conference"