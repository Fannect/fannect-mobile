do ($ = jQuery, ko = window.ko, fc = window.fannect) ->

   class fc.viewModels.Profile.Other extends fc.viewModels.Profile
      constructor: () ->
         @is_friend = ko.observable(false)
         @showSentPopup = ko.observable(false)
         @showAcceptedPopup = ko.observable(false)
         @showAlreadySentPopup = ko.observable(false)
         super

      setup: () =>
      load: () =>
         @is_friend(false)
         @showSentPopup(false)
         @showAcceptedPopup(false)
         @showAlreadySentPopup(false)

         finish = (err, profile) =>
            throw err if err
            @is_friend(profile.is_friend) 
            @params.user_id = profile.user_id
 
            profile.profile_image_url = "images/fannect_UserPlaceholderPic@2x.png" unless profile.profile_image_url?.length > 2
            profile.team_image_url = "images/fannect_TeamPlaceholderPic@2x.png" unless profile.team_image_url?.length > 2

            fc.user.get (err, user) =>
               profile.is_friend = true if profile.user_id == user._id
               @updateProfile(profile)

               if (profile.user_id in user.invites)
                  @params.action = "accept"

               unless (profile.is_friend or profile.is_invited)
                  fc.mobile.addHeaderButton
                     position: "right"
                     text: if @params.action == "accept" then "Accept" else "Add"
                     click: @rightButtonClick

         fc.team.getActive (err, profile) =>
            if @params.user_id 
               fc.ajax
                  url: "#{fc.getResourceURL()}/v1/teamprofiles?user_id=#{@params.user_id}&friends_with=#{profile._id}"
                  type: "GET"
               , finish
            else
               if @params.team_profile_id == profile._id then @is_friend(true)
               fc.ajax 
                  url: "#{fc.getResourceURL()}/v1/teamprofiles/#{@params.team_profile_id}?is_friend_of=#{profile._id}"
                  type: "GET"
               , finish

      selectTeam: () -> return false
      isEditable: () -> return false
      changeUserImage: () -> return false
      changeTeamImage: () -> return false

      rightButtonClick: () =>
         if @params.action == "accept"
            @_acceptInvite()
         else
            @_sendInvite()

      _acceptInvite: () =>
         @_hideRightButton()
         fc.ajax
            url: "#{fc.getResourceURL()}/v1/me/invites"
            type: "POST"
            data: user_id: @params.user_id 
         , (err, data) =>
            @showAcceptedPopup(true) if data.status == "success" 

      _sendInvite: () =>
         if not @is_friend()
            fc.user.get (err, user) =>
               @_hideRightButton()
               forge.flurry.customEvent("Send Invite", {sendInvite: true})
               fc.ajax
                  url: "#{fc.getResourceURL()}/v1/users/#{@params.user_id}/invite"
                  type: "POST"
                  data: inviter_user_id: user._id
               , (err, data) =>
                  return @showAlreadySentPopup(true) if err
                  @showSentPopup(true) if data?.status == "success" 

      closePopup: () =>
         @showSentPopup(false) if @showSentPopup()
         @showAcceptedPopup(false) if @showAcceptedPopup()
         @showAlreadySentPopup(false) if @showAlreadySentPopup()
               
      _hideRightButton: () =>
         forge.topbar.removeButtons () ->
            window.fannect.mobile.addHeaderButton 
               text: "Back"
               position: "left"
               style: "back"
               click: () -> $.mobile.back()

      onPageHide: () =>
         @updateProfile({})
         @events.reset()
        