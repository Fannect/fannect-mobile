do ($ = jQuery, ko = window.ko, fc = window.fannect) ->

   class fc.viewModels.Profile extends fc.viewModels.Base 
      constructor: () ->
         super
         @editing_image = ko.observable("none")
         @name = ko.observable("&nbsp;")
         @profile_image = ko.observable "images/fannect_UserPlaceholderPic@2x.png"
         @team_image = ko.observable "images/fannect_TeamPlaceholderPic@2x.png"
         @team_name = ko.observable "Loading..."
         @roster = ko.observable()
         @points = ko.observable()
         @rank = ko.observable()
         @breakdown = ko.observableArray()
         @shout = ko.observable()
         @new_shout = ko.observable("")
         @shouting = ko.observable(false) 
         @load()

         @showProfileImagePopup = ko.computed () => @editing_image() == "profile"
         @showTeamImagePopup = ko.computed () => @editing_image() == "team"

      load: () =>
         fc.team.subscribe @updateProfile
         fc.team.getActive()

      updateProfile: (profile) =>
         return unless profile

         if @isEditable()
            profile.profile_image_url = "images/profile/Profile_tapToAddProfilePhoto@2x.png" unless profile.profile_image_url?.length > 2
            profile.team_image_url = "images/profile/Profile_tapToAddTeamPhoto@2x.png" unless profile.team_image_url?.length > 2

         @name profile.name or "&nbsp;"
         @profile_image profile.profile_image_url or ""
         @team_image profile.team_image_url or ""
         @team_name profile.team_name
         @roster profile.roster or 0
         @points profile.points?.overall or 0
         @rank profile.rank or 0
         @shout profile.shouts?[0]?.text

         # Add chart data
         @breakdown.removeAll()
         @breakdown.push
            val: profile.points?.passion or 0
            style: "passion"
         @breakdown.push
            val: profile.points?.dedication or 0
            style: "dedication"
         @breakdown.push
            val: profile.points?.knowledge or 0
            style: "knowledge"

      onPageShow: () -> setTimeout (() -> forge.launchimage.hide() if forge.is.mobile()), 200
      selectTeam: () -> $.mobile.changePage "profile-selectTeam.html", transition: "slide"
      changeUserImage: () => @editing_image "profile"
      changeTeamImage: () => @editing_image "team"
      cancelImagePicking: () => @editing_image "none"
      isEditable: () -> return true

      startShouting: () =>
         if @isEditable()
            @shouting(not @shouting())
      
      submitShout: () =>
         newShout = @new_shout()
         if newShout?.length > 0 and newShout.length <= 140
            @shouting(false)
            setTimeout (()=> @new_shout("")), 400

            fc.team.updateActive({shouts: [{text: newShout}]})
            fc.team.getActive (err, profile) =>
               # @shout(newShout)
               fc.ajax
                  url: "#{fc.getResourceURL()}/v1/me/teams/#{profile._id}/shouts"
                  type: "POST"
                  data: shout: newShout
         else
            # Notify that the shout is too long

         @shouting(false)

      stopShouting: () =>
         @shouting(false)

      takeImage: (data, e) =>
         if @isEditable()
            done = if @editing_image() == "profile" then @_uploadProfileImage else @_uploadTeamImage
            @editing_image("none")
            forge.file.getImage source: "camera", done
         
      chooseImage: (data, e) ->
         if @isEditable()
            done = if @editing_image() == "profile" then @_uploadProfileImage else @_uploadTeamImage
            @editing_image("none")
            forge.file.getImage source: "gallery", done

      leftButtonClick: () ->
         $.mobile.changePage "profile-invites.html", transition: "slidedown"

      rightButtonClick: () ->
         $.mobile.changePage "settings.html", transition: "slidedown"

      _uploadProfileImage: (file) =>
         file.name = "image"
         # forge.file.URL(file, (url) -> console.log("URL: #{url}"); fc.team.updateActive(profile_image_url: url))

         fc.ajax 
            url: "#{fc.getResourceURL()}/v1/images/me"
            type: "POST"
            files: [file]
         , (err, data) ->
            fc.team.updateActive(data) if data.profile_image_url

      _uploadTeamImage: (file) =>
         file.name = "image"
         # forge.file.URL(file, (url) -> fc.team.updateActive(team_image_url: url))

         fc.team.getActive (err, profile) =>
            fc.ajax 
               url: "#{fc.getResourceURL()}/v1/images/me/#{profile._id}"
               type: "POST"
               files: [file]
            , (err, data) ->
               fc.team.updateActive(data) if data.team_image_url
               