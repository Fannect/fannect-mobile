do ($ = jQuery, ko = window.ko, fc = window.fannect) ->

   class fc.viewModels.Profile.SelectTeam.ChooseSport extends fc.viewModels.Base 
      constructor: () ->
         super 
         @sports = ko.observableArray []
         @load()

      load: (done) ->
         fc.ajax 
            url: "#{fc.getResourceURL()}/v1/sports"
            type: "GET"
         , (error, sports) =>
            @sports.push sport for sport in sports
            done null, sports if done

      selectSport: (data) -> fc.cache.set("sport_key", data.sport_key)