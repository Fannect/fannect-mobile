do ($ = jQuery, ko = window.ko, fc = window.fannect) ->
   
   class fc.viewModels.Connect.Roster.FacebookFriends extends fc.viewModels.Base 
      constructor: () ->
         super 
         @friends = ko.observableArray()
         @loading = ko.observable(true)
         @failed = ko.observable(false)
         @loadFriends()

      loadFriends: () =>
         @failed(false)
         fc.user.getFacebookAccessToken (err, token) =>
            forge.logging.critical("TOKEN: #{token} ---------------------------------")
            return @failed(true) if err or not token
               
            @loading(true)
            fc.ajax
               url: "#{fc.getResourceURL()}/v1/me/facebook/friends?facebook_access_token=#{token}"
            , (err, friends) =>
               @loading(false)
               return @failed(true) if err
               @friends(friends or [])

      selectUser: (data) -> $.mobile.changePage "profile-other.html?team_profile_id=#{data._id}", transition:"slide"
      shareViaTwitter: () -> fc.share.viaTwitter()
      shareViaEmail: () -> fc.share.viaEmail()
      shareViaSMS: () -> fc.share.viaSMS()
