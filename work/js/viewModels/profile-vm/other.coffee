do ($ = jQuery, ko = window.ko, fc = window.fannect) ->

   class fc.viewModels.Profile.Other extends fc.viewModels.Profile
      constructor: (options) ->
         @options = options
         @is_friend = ko.observable(false)
         @showSentPopup = ko.observable(false)
         super

      load: () =>
         finish = (err, profile) =>
            throw err if err
            @other_user_id = profile.user_id
            @is_friend(profile.is_friend) 
            @updateProfile(profile)

         fc.team.getActive (err, profile) =>
            if @options.user_id 
               fc.ajax
                  url: "#{fc.getResourceURL()}/v1/teamprofiles?user_id=#{@options.user_id}&friends_with=#{profile._id}"
                  type: "GET"
               , finish
            else
               if @options.team_profile_id == profile._id then @is_friend(true)
               fc.ajax 
                  url: "#{fc.getResourceURL()}/v1/teamprofiles/#{@options.team_profile_id}?is_friend_of=#{profile._id}"
                  type: "GET"
               , finish

      selectTeam: () -> return false
      isEditable: () -> return false
      changeUserImage: () -> return false
      changeTeamImage: () -> return false

      rightButtonClick: () =>
         if @options.invite == "accept"
            _acceptInvite()
         else
            _sendInvite()

      _acceptInvite: () =>
         @_hideRightButton()
         fc.ajax
            url: "#{fc.getResourceURL()}/v1/me/invites"
            type: "POST"
            data: user_id: data._id
         , (err, data) => throw(err) if err

      _sendInvite: () =>
         if not @is_friend()
            fc.user.get (err, user) =>
               @_hideRightButton()
               fc.ajax
                  url: "#{fc.getResourceURL()}/v1/users/#{@other_user_id}/invite"
                  type: "POST"
                  data: inviter_user_id: user._id
               , (err, data) =>
                  throw err if err
                  @showSentPopup(true) if data.status == "success" 
               
      _hideRightButton: () =>
         forge.topbar.removeButtons () ->
            window.fannect.mobile.addHeaderButton 
               text: "Back"
               position: "left"
               click: @leftButtonClick



