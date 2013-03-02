do ($ = jQuery, ko = window.ko, fc = window.fannect) ->

   class fc.viewModels.Leaderboard.Breakdown extends fc.viewModels.Base 

      constructor: () ->
         super
         @breakdown = ko.observableArray()
         @name = ko.observableArray()
         
      getUrl: (done) -> 
         fc.team.getActive (err, profile) ->
            done "#{fc.getResourceURL()}/v1/leaderboard/teams/#{profile.team_id}/breakdown"

      load: () =>
         @getUrl (url) =>
            fc.ajax 
               url: url
               type: "GET"
            , (error, team) =>
               @name(team.full_name)
               @breakdown.removeAll()
               @breakdown.push
                  val: team.points?.passion or 0
                  style: "passion"
               @breakdown.push
                  val: team.points?.dedication or 0
                  style: "dedication"
               @breakdown.push
                  val: team.points?.knowledge or 0
                  style: "knowledge"
                  
               console.log @breakdown()

