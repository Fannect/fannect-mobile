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
            
            start = 0
            showResults = () =>
               console.log "start", 0
               for i in [start..start+5] by 1
                  if i >= teams.length
                     @is_loading(false)
                     return
                  start = i
                  @teams.push teams[i]
               setTimeout showResults, 5

            showResults()
            
      selectTeam: (data) -> 
         fc.team.create data._id, (err) ->
            if err?.reason == "duplicate"
               $.mobile.loading "show",
                  text: "Already a fan!"
                  textVisible: true
                  textonly: true
                  theme: "a"
               setTimeout (-> $.mobile.loading "hide"), 1500
            else
               $.mobile.changePage "profile.html", transition: "slideup"