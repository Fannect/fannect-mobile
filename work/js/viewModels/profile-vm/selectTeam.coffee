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
               @teams.push team for team in teams
            else 
               fc.cache.set("no_team_profile", true)
               $.mobile.changePage "profile-selectTeam-chooseSport.html", fc.transition("slide")

      selectTeam: (data) ->
         fc.team.setActive data._id, (err) ->
            $.mobile.changePage "profile.html", fc.transition("slideup")

      rightButtonClick: () ->
         $.mobile.changePage "profile-selectTeam-chooseSport.html", fc.transition("slide")

      onPageShow: () => @load()
