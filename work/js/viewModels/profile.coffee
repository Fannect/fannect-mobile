do ($ = jQuery, ko = window.ko, fc = window.fannect) ->

   class fc.viewModels.Profile extends fc.viewModels.Base 
      constructor: () ->
         console.log "PROFILE"
         super
         @editing_image = ko.observable("none")
         @name = ko.observable("&nbsp;")
         @team_image = ko.observable ""
         @profile_image = ko.observable ""
         @team_name = ko.observable "Loading..."
         @roster = ko.observable()
         @points = ko.observable()
         @rank = ko.observable()
         @trash_talk = ko.observable()
         @breakdown = ko.observableArray()
         @load()

      load: () =>
         fc.team.subscribe @updateProfile
         fc.team.getActive()

      updateProfile: (profile) =>
         return unless profile
         @name profile.name or "&nbsp;"
         @profile_image profile.profile_image_url or ""
         @team_image profile.team_image_url or ""
         @team_name profile.team_name
         @roster profile.roster or 0
         @points profile.points?.overall or 0
         @rank profile.rank or 0
         @trash_talk profile.trash_talk

         # Add chart data
         @breakdown.removeAll()
         if profile.points
            @breakdown.push
               val: profile.points.passion
               style: "passion"
            @breakdown.push
               val: profile.points.dedication
               style: "dedication"
            @breakdown.push
               val: profile.points.knowledge
               style: "knowledge"

      selectTeam: () -> $.mobile.changePage "profile-selectTeam.html", transition: "slide"
      changeUserImage: () => @editing_image "profile"
      changeTeamImage: () => @editing_image "team"
      cancelImagePicking: () => @editing_image "none"
      isEditable: () -> return true
       
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

      leftButtonClick: () ->
         $.mobile.changePage "profile-invites.html", transition: "slidedown"

      rightButtonClick: () ->
         $.mobile.changePage "settings.html", transition: "slidedown"

      _uploadProfileImage: (file) ->
         # TESTING
         # forge.file.base64 file
         # , (data) ->
         #    src = "data:image/png;base64,#{data}"
         #    fc.getDataURL src, 500, 500, (data_url) ->

         #       fc.ajax
         #          url: "#{fc.getResourceURL()}/v1/images/me"
         #          type: "POST"
         #          fileUploadMethod: "raw"
         #          data: data_url
         #       , (err, res) ->
         #          console.log "SHRANK IMAGE: #{JSON.stringify(res)}"
               
            # data:image/png;base64,
         #END TESTING

         file.name = "image"
         fc.ajax 
            url: "#{fc.getResourceURL()}/v1/images/me"
            type: "POST"
            files: [file]
         , (err, data) ->
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
