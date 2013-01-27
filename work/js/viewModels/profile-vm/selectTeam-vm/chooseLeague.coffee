do ($ = jQuery, ko = window.ko, fc = window.fannect) ->

   class fc.viewModels.Profile.SelectTeam.ChooseLeague extends fc.viewModels.Base 
      constructor: () ->
         super 

         # Return if user has not selected a sport
         unless fc.cache.hasKey("sport_key")
            $.mobile.changePage "profile-selectTeam.html", transition: "none"
         
         @leagues = ko.observableArray []
         @load()

      load: (done) ->
         fc.ajax 
            url: "#{fc.getResourceURL()}/v1/sports/#{fc.cache.get('sport_key')}/leagues"
            type: "GET"
         , (error, leagues) =>
            @leagues.push league for league in leagues
            done null, leagues if done

      selectLeague: (data) -> fc.cache.set("league_key", data.league_key)