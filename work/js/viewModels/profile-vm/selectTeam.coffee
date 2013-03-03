do ($ = jQuery, ko = window.ko, fc = window.fannect) ->

   class fc.viewModels.Profile.SelectTeam extends fc.viewModels.Base 
      constructor: () ->
         super 
         @teams = ko.observableArray []
         @is_loading = ko.observable(true)
         
      load: (done) =>
         @is_loading(true)
         @teams.removeAll()
         fc.ajax 
            url: "#{fc.getResourceURL()}/v1/me/teams"
            type: "GET"
            retry: "forever"
         , (error, teams) =>
            @is_loading(false)
            if teams.length > 0
               for team in teams
                  team.sport_key = "sport-#{team.sport_key or '15008000'}"
                  @teams.push(team) 
            else 
               $.mobile.changePage "profile-selectTeam-chooseSport.html?hide_back=true", transition: "slide"

      selectTeam: (data) ->
         fc.team.setActive data._id, (err) ->
            $.mobile.changePage "profile.html", transition: "slideup"

      rightButtonClick: () ->
         $.mobile.changePage "profile-selectTeam-chooseSport.html", transition: "slide"
