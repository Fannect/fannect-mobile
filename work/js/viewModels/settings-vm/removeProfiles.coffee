do ($ = jQuery, ko = window.ko, fc = window.fannect) ->

   fc.viewModels.Settings = {}

   class fc.viewModels.Settings.RemoveProfiles extends fc.viewModels.Base 
      constructor: () ->
         super 
         @teams = ko.observableArray []
         @is_loading = ko.observable(true)
         @deleteText = ko.observable()
         @showConfirm = ko.observable()
         @selectedTeam = null
         @load()

      load: (done) ->
         fc.ajax 
            url: "#{fc.getResourceURL()}/v1/me/teams"
            type: "GET"
         , (error, teams) =>
            @is_loading(false)
            @teams.push team for team in teams
        
      confirmDelete: (data) =>
         @deleteText("<span style='font-weight:normal'>Are you sure you want to delete your profile for</span> #{data.team_name}<span style='font-weight:normal'>?</span>")
         @showConfirm(true)
         @selectedTeam = data

      hideProfile: (element) -> $el = $(element).slideUp 400, () -> $el.remove()
      removeProfile: () =>
         @showConfirm(false)
         @teams.remove @selectedTeam
         fc.team.remove @selectedTeam._id, () -> @is_loading(false)
