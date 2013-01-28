do ($ = jQuery, ko = window.ko, fc = window.fannect) ->

   class fc.viewModels.Leaderboard.Breakdown extends fc.viewModels.Base 

      constructor: () ->
         super
         @breakdown = ko.observableArray()
         @no_data = ko.observable(false)
         @load()

      getUrl: () -> "#{fc.getResourceURL()}/v1/leaderboard/teams/#{fc.team.getActiveTeamId()}/breakdown"

      load: () =>
         fc.ajax 
            url: @getUrl()
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
               @no_data(true)

