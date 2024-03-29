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
         @verified = ko.observable()
         @breakdown = ko.observableArray() 
         @shout = ko.observable()
         @shout_date = ko.observable()
         @next_game = ko.observable(new fc.models.NextGame())
         @events = new fc.models.Events()
         @photos = new fc.models.Photos()
         
         @showProfileImagePopup = ko.computed () => @editing_image() == "profile"
         @showTeamImagePopup = ko.computed () => @editing_image() == "team"

         @setup()
         
      setup: () =>
         fc.team.onTeamUpdated @updateProfile
         fc.team.getActive (err, profile) => 
            return fc.msg.show("Unable to load profile!") if err
            @updateProfile(profile)

      updateProfile: (profile) =>
         return unless profile

         if @isEditable()
            profile.profile_image_url = "images/profile/Profile_tapToAddProfilePhoto@2x.png" unless profile.profile_image_url?.length > 2
            profile.team_image_url = "images/profile/Profile_tapToAddTeamPhoto@2x.png" unless profile.team_image_url?.length > 2
            @events.setup(profile._id, "You")
            @photos.setup(profile._id)
         else
            @events.setup(profile._id, profile.name)
            @photos.setup(profile._id)

         @name profile.name or "&nbsp;"
         @profile_image profile.profile_image_url or ""
         @team_image profile.team_image_url or ""
         @team_name profile.team_name
         @roster profile.friends_count or 0
         @points profile.points?.overall or 0
         @rank profile.rank or 0
         @verified profile.verified or ""
         @shout profile.shouts?[0]?.text or "Shout something!"
        
         if profile.shouts?[0]?._id
            # Check if the person just shouted
            if not ((date = profile.shouts?[0]?._id) instanceof Date)
               date = fc.parseId(date)
            @shout_date dateFormat(date, " mm/dd/yyyy h:MM TT")
         else
            @shout_date("")

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

      _addHeaderButtons: () ->
         fc.user.get (err, user) ->
            if fc.nav.getActivePath() == "profile.html"
               fc.mobile.addHeaderButton
                  position: "right"
                  icon: "images/profile/settingsIcon@2x.png"
                  click: -> $.mobile.changePage "settings.html", fc.transition("slidedown")
               fc.mobile.addHeaderButton
                  position: "left"
                  icon: if (user?.invites?.length > 0) then "images/mobile/rosterInviteActiveIcon.png" else "images/mobile/rosterInviteIcon.png"
                  click: -> $.mobile.changePage "profile-invites.html", fc.transition("slidedown")

      onPageShow: () => 
         super
         if @isEditable()
            fc.mobile.setActiveMenu("profile")
            if forge.is.mobile()
               setTimeout (-> 
                  forge.launchimage.hide() 
               ), 200
            fc.team.refreshActive()
            @_addHeaderButtons() if forge.is.mobile()

         fc.logger.shouldReset(true)

      selectTeam: () -> $.mobile.changePage "profile-selectTeam.html", fc.transition("slide")
      changeUserImage: () => @editing_image "profile"
      changeTeamImage: () => @editing_image "team"
      cancelImagePicking: () => @editing_image "none"
      chooseWebImage: () => 
         @editing_image("none")
         $.mobile.changePage "profile-chooseWebImage.html", transition: "slide"

      isEditable: () -> return true

      startShouting: () =>
         if @isEditable()
            $.mobile.changePage "profile-shout.html", transition: "slideup"

      sliderOptions: () =>
         if @isEditable()
            return { 
               hide: @sliderHide, 
               show: @sliderShow, 
               count: 4, 
               titles: [ "Next Game", "Fan DNA", "Activity", "Photos" ] 
            }
         else
            return { 
               hide: @sliderHide, 
               show: @sliderShow, 
               count: 3, 
               titles: [ "Fan DNA", "Activity", "Photos" ] 
            }

      # HANDLING SLIDER
      sliderHide: (index) =>

      sliderShow: (index, has_init) =>
         index++ unless @isEditable()

         if index == 0 and not has_init
            fc.team.getActive (err, profile) =>
               fc.ajax
                  url: "#{fc.getResourceURL()}/v1/teams/#{profile.team_id}?content=next_game"
                  cache: true
               , (err, next_game) =>
                  @next_game().set(next_game)
                  @next_game.valueHasMutated()

         if index == 2 and not has_init
            @events.load()

         if index == 3 and not has_init
            @photos.load()


      # HANDLING IMAGES
      pullTwitterImage: () =>

         getImage = () =>
            @editing_image("none")
            fc.team.updateActive(profile_image_url: "images/profile/LoadingProfileImage@2x.png")
            fc.msg.loading("Pulling profile image from Twitter...")

            fc.team.getActive (err, profile) =>
               return fc.msg.show("Unable to pull to fetch profile!") if err
               fc.ajax 
                  url: "#{fc.getResourceURL()}/v1/images/me"
                  type: "POST"
                  data: pull_twitter: true
               , (err, data) =>
                  fc.msg.hide()
                  return fc.msg.show("Unable to pull in your profile from Twitter!") if err
                  fc.team.updateActive(data) if data.profile_image_url

         fc.user.get (err, user) =>
            return fc.msg.show("Unable to pull to fetch profile!") if err
            if user?.twitter then getImage()
            else fc.user.linkTwitter (err, success) => getImage() if success

      takeImage: (data, e) =>
         if @isEditable()
            done = if @editing_image() == "profile" then @_uploadProfileImage else @_uploadTeamImage
            @editing_image("none")

            if forge.is.ios()
               forge.file.getImage { source: "camera", height: 600, width: 600 }, done
            else
               forge.file.getImage { source: "camera" }, done

      chooseImage: (data, e) ->
         if @isEditable()
            done = if @editing_image() == "profile" then @_uploadProfileImage else @_uploadTeamImage
            @editing_image("none")

            if forge.is.ios()
               forge.file.getImage { source: "gallery", height: 800, width: 800 }, done
            else
               forge.file.getImage { source: "gallery" }, done

      _uploadProfileImage: (file) =>
         file.name = "image"
         fc.team.updateActive(profile_image_url: "images/profile/LoadingProfileImage@2x.png")

         fc.images.uploadProfile file, (err, data) ->
            return fc.msg.show("Unable to upload your image at this time!") if err
            fc.team.updateActive(profile_image_url: data.url)
            fc.ajax 
               url: "#{fc.getResourceURL()}/v1/images/me/update"
               type: "POST"
               data: { image_url: data.url }
            
      _uploadTeamImage: (file) =>
         file.name = "image"
         fc.team.updateActive(team_image_url: "images/profile/LoadingTeamImage@2x.png")
      
         fc.team.getActive (err, profile) ->
            profile_id = profile._id      
           
            fc.images.uploadProfile file, (err, data) ->
               return fc.msg.show("Unable to upload your image at this time!") if err
               
               # Only change the 
               fc.team.updateTeam(profile_id, team_image_url: data.url)
               fc.ajax 
                  url: "#{fc.getResourceURL()}/v1/images/me/#{profile_id}/update"
                  type: "POST"
                  data: { image_url: data.url }
               