do ($ = jQuery, ko = window.ko, fc = window.fannect) ->

   class fc.viewModels.Leaderboard.BreakdownOther extends fc.viewModels.Leaderboard.Breakdown 

      constructor: () ->
         @team_id = @team_id or fc.cache.pull("leaderboard_team_id")
         return $.mobile.changePage "leaderboard.html", transition: "none" unless @team_id
         super
         
      getUrl: (done) => 
         done "#{fc.getResourceURL()}/v1/leaderboard/teams/#{@team_id}/breakdown"