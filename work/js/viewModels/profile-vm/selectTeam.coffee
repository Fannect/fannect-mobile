do ($ = jQuery, ko = window.ko, fc = window.fannect) ->

   class fc.viewModels.Profile.SelectTeam extends fc.viewModels.Base 
      constructor: () ->
         super 
         @teams = ko.observableArray []
         @has_loaded = ko.observable false
         @load()

      load: (done) ->
         fc.ajax 
            url: "#{fc.getResourceURL()}/v1/me/teams"
            type: "GET"
         , (error, teams) =>
            @has_loaded true
            @teams.push team for team in teams
            done null, teams if done

      selectTeam: (data) ->
         fc.team.setActive data.team_profile_id, true, () ->
            $.mobile.changePage "profile.html", transition: "slideup"
            # window.history.back()

      rightButtonClick: () ->
         # $.mobile.changePage "connect-addToRoster.html", transition: "slide"
