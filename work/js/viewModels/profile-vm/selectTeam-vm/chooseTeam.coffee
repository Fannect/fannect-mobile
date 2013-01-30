do ($ = jQuery, ko = window.ko, fc = window.fannect) ->

   class fc.viewModels.Profile.SelectTeam.ChooseTeam extends fc.viewModels.Base 
      constructor: () ->
         super 

         # Return if user has not selected a sport
         unless fc.cache.hasKey("sport_key") and fc.cache.hasKey("league_key")
            $.mobile.changePage "profile-selectTeam.html", transition: "none"
         
         @teams = ko.observableArray []
         @is_loading = ko.observable(true)
         @load()

      load: () ->
         fc.ajax 
            url: "#{fc.getResourceURL()}/v1/sports/#{fc.cache.get('sport_key')}/leagues/#{fc.cache.get('league_key')}/teams"
            type: "GET"
         , (error, teams) =>
            @is_loading(false)
            @teams.push team for team in teams

      selectTeam: (data) -> 
         fc.team.create data._id, () ->
            $.mobile.changePage "profile.html", transition: "slideup"