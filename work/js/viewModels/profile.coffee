do ($ = jQuery, ko = window.ko, fc = window.fannect) ->

   class fc.viewModels.Profile extends fc.viewModels.Base 
      constructor: () ->
         super
         @editing_image = ko.observable("none")
         @name = ko.observable()
         @team_image = ko.observable ""
         @profile_image = ko.observable ""
         @favorite_team = ko.observable() 
         @roster = ko.observable()
         @points = ko.observable()
         @rank = ko.observable()
         @bio = ko.observable()
         @game_day_spot = ko.observable()
         @bragging_rights = ko.observable()  
         @load()

         fc.user.subscribe @updateUser

      load: () =>
         fc.user.get (err, data) => @updateUser data

      updateUser: (user) =>
         @name user.name
         @team_image user.team_image or ""
         @profile_image user.profile_image or ""
         @favorite_team user.favorite_team or "Select Team"
         @roster user.roster
         @points user.points
         @rank user.rank
         @bio user.bio
         @game_day_spot user.game_day_spot
         @bragging_rights user.bragging_rights

      changeUserImage: () => @editing_image "profile"
      changeTeamImage: () => @editing_image "team"
      cancelImagePicking: () => @editing_image "none"
       
      takeImage: (data, e) =>
         done = if @editing_image() == "profile" then @_uploadProfileImage else @_uploadTeamImage

         forge.file.getImage source: "camera", done
         , (error) ->
            console.log "ERROR: #{JSON.stringify(error)}"
         
      chooseImage: (data, e) ->
         done = if @editing_image() == "profile" then @_uploadProfileImage else @_uploadTeamImage
         
         forge.file.getImage source: "gallery", done
         , (error) ->
            console.log "ERROR: #{JSON.stringify(error)}"

      _uploadProfileImage: (file) ->
         file.name = "image"
         fc.ajax 
            url: "#{fc.getResourceURL()}/v1/images/me"
            type: "POST"
            files: [file]
         , (err, data) ->
            console.log "PROFILE IMAGE: #{JSON.stringify(data)}"
            fc.user.save profile_image: data.image_url

      _uploadTeamImage: (file) ->
         file.name = "image"
         fc.ajax 
            url: "#{fc.getResourceURL()}/v1/images/me/someteam"
            type: "POST"
            files: [file]
         , (err, data) ->
            console.log "TEAM IMAGE: #{JSON.stringify(data)}"
            fc.user.save team_image: data.image_url
