do ($ = jQuery, ko = window.ko, fc = window.fannect) ->

   class fc.viewModels.Profile extends fc.viewModels.Base 
      constructor: () ->
         super
         @editingImage = ko.observable()
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

      load: () ->
         fc.user.get (err, data) =>
            @name data.name
            @team_image data.team_image or ""
            @profile_image data.profile_image or ""
            @favorite_team data.favorite_team or "Select Team"
            @roster data.roster
            @points data.points
            @rank data.rank
            @bio data.bio
            @game_day_spot data.game_day_spot
            @bragging_rights data.bragging_rights

      changeUserImage: (data, e) ->
         @editingImage "profile"
         # $("#changeProfileImagePopup").popup "open", 
         #    transition: "pop"
         #    positionTo: "window"

      changeTeamImage: (data, e) -> 
         @editingImage "team"
         # $("#changeTeamImagePopup").popup "open", 
         #    transition: "pop"
         #    positionTo: "window"

      takeImage: (data, e) ->
         forge.file.getImage
            source: "camera"
         , (file) ->
            console.log "FILE: #{JSON.stringify(file)}"
         , (error) ->
            console.log "ERROR: #{JSON.stringify(error)}"
         
      chooseImage: (data, e) ->
         forge.file.getImage
            source: "gallery"
         , (file) ->
            console.log "FILE: #{JSON.stringify(file)}"
         , (error) ->
            console.log "ERROR: #{JSON.stringify(error)}"

      chooseWebImage: () -> ""


      onImageDataSuccess: (image) ->
         # save image
         if @editingImage() == "profile"
            @profile_image(image)
            $("#changeProfileImagePopup").popup "close"
         else if @editingImage() == "team"
            @team_image(image)
            $("#changeTeamImagePopup").popup "close"

      cancelImagePicking: () ->
         @editingImage "none"

      phoneGapImageError: (message) ->
         alert("ERROR: " + message);

         $("#imageFailedPopup").popup "open", 
            transition: "pop"
            positionTo: "window"