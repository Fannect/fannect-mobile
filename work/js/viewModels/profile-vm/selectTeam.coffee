do ($ = jQuery, ko = window.ko, fc = window.fannect) ->

   class fc.viewModels.Profile.SelectTeam extends fc.viewModels.Base 
      constructor: () ->
         super 
         @teams = ko.observableArray []
         @has_loaded = ko.observable(false)
         @load()

      load: (done) ->
         console.log "HIT HERE"
         fc.ajax 
            url: "#{fc.getResourceURL()}/v1/me/teams"
            type: "GET"
         , (error, teams) =>
            @has_loaded true
            if teams.length > 0
               @teams.push team for team in teams
            else 
               fc.cache.set("no_team_profile", true)
               $.mobile.changePage "profile-selectTeam-chooseSport.html", transition: "slide"

      selectTeam: (data) ->
         fc.team.setActive data._id, () ->
            $.mobile.changePage "profile.html", transition: "slideup"

      rightButtonClick: () ->
         $.mobile.changePage "profile-selectTeam-chooseSport.html", transition: "slide"
