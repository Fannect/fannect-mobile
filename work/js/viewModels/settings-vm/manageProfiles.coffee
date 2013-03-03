do ($ = jQuery, ko = window.ko, fc = window.fannect) ->

   fc.viewModels.Settings = {}

   class fc.viewModels.Settings.ManageProfiles extends fc.viewModels.Base 
      constructor: () ->
         super 
         @teams = ko.observableArray []
         @is_loading = ko.observable(true)
         @deleteText = ko.observable()
         @selectedTeam = null
         
      load: (done) ->
         @teams.removeAll()
         @is_loading(true)
         fc.ajax 
            url: "#{fc.getResourceURL()}/v1/me/teams"
            type: "GET"
            cache: false
         , (error, teams) =>
            @is_loading(false)
            for team in teams
               team.sport_key = "sport-#{team.sport_key or '15008000'}"
               @teams.push(team)

      confirmDelete: (data) =>
         @selectedTeam = data
         @deleteText("<span style='font-weight:normal'>Are you sure you want to delete your profile for</span> #{data.team_name}<span style='font-weight:normal'>?</span>")
         
      cancel: () => @selectedTeam = null

      hideProfile: (element) => 
         $el = $(element).slideUp 400, () => $el.remove()

      removeProfile: () =>
         @teams.remove @selectedTeam
         fc.team.remove @selectedTeam._id, 
         fc.team.removeFromChannel(@selectedTeam.team_id)

      selectTeam: (data) ->
         fc.team.setActive data._id, (err) ->
            $.mobile.changePage "profile.html", transition: "slideup"

      rightButtonClick: () ->
         $.mobile.changePage "profile-selectTeam-chooseSport.html", transition: "slide"