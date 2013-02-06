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

      load: (done) ->
         @teams.removeAll()
         @is_loading(true)
         fc.ajax 
            url: "#{fc.getResourceURL()}/v1/me/teams"
            type: "GET"
         , (error, teams) =>
            @is_loading(false)
            @teams.push team for team in teams
        
      confirmDelete: (data) =>
         @selectedTeam = data
         @deleteText("<span style='font-weight:normal'>Are you sure you want to delete your profile for</span> #{data.team_name}<span style='font-weight:normal'>?</span>")
         @showConfirm(true)

      cancel: () =>
         @showConfirm(false)
         @selectedTeam = null

      hideProfile: (element) => 
         $el = $(element).slideUp 400, () => $el.remove()

      removeProfile: () =>
         @showConfirm(false)
         @teams.remove @selectedTeam
         fc.team.remove @selectedTeam._id, 
         fc.team.removeFromChannel(@selectedTeam.team_id)


      onPageShow: () => @load()