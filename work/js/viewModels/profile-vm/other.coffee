do ($ = jQuery, ko = window.ko, fc = window.fannect) ->

   class fc.viewModels.Profile.Other extends fc.viewModels.Profile
      constructor: (profileId) ->
         @other_id = profileId
         @is_friend = ko.observable()
         super

      load: () =>
         fc.ajax 
            url: "#{fc.getResourceURL()}/v1/teamprofiles/#{@other_id}?is_friend_of=#{fc.team.getActiveId()}"
            type: "GET"
         , (err, profile) =>
            throw err if err
            @other_user_id = profile.user_id
            @is_friend(profile.is_friend) 
            @updateProfile(profile)

      selectTeam: () -> return false
      isEditable: () -> return false
      changeUserImage: () -> return false
      changeTeamImage: () -> return false

      rightButtonClick: () =>
         user.get (user) =>
         fc.ajax
            url: "#{fc.getResourceURL()}/v1/users/#{@other_user_id}/invite"
            type: "POST"
            data: inviter_user_id: user._id
         , () -> console.log "SUCCESS"
         forge.topbar.removeButtons () ->
            window.fannect.mobile.addHeaderButton 
               text: "Back"
               position: "left"
               click: @leftButtonClick