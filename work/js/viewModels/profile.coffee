do ($ = jQuery, ko = window.ko, fc = window.fannect) ->

   class fc.viewModels.Profile
      constructor: (done) ->
         @editingImage = ko.observable false
         fc.user.get (err, data) =>
            @name = ko.observable data.name
            @team_image = ko.observable data.team_image or ""
            @profile_image = ko.observable data.profile_image or ""
            @favorite_team = ko.observable data.favorite_team or "Select Team"
            @roster = ko.observable data.roster
            @points = ko.observable data.points
            @rank = ko.observable data.rank
            @bio = ko.observable data.bio
            @game_day_spot = ko.observable data.game_day_spot
            @bragging_rights = ko.observable data.bragging_rights
            done err, @

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