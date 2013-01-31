do ($ = jQuery, ko = window.ko, fc = window.fannect) ->

   class fc.viewModels.Leaderboard.Breakdown extends fc.viewModels.Base 

      constructor: () ->
         super
         @breakdown = ko.observableArray()
         @no_data = ko.observable(false)
         @load()

      getUrl: (done) -> 
         fc.team.getActive (err, profile) ->
            done "#{fc.getResourceURL()}/v1/leaderboard/teams/#{profile.team_id}/breakdown"

      load: () =>
         @getUrl (url) =>
            fc.ajax 
               url: url
               type: "GET"
            , (error, points) =>
               if points.passion and points.dedication and points.knowledge
                  @breakdown.removeAll()
                  @breakdown.push
                     val: points.passion
                     style: "passion"
                  @breakdown.push
                     val: points.dedication
                     style: "dedication"
                  @breakdown.push
                     val: points.knowledge
                     style: "knowledge"
               else
                  console.log "HIT"
                  @no_data(true)

