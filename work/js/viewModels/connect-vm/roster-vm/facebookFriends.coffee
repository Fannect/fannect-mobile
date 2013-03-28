do ($ = jQuery, ko = window.ko, fc = window.fannect) ->
   
   class fc.viewModels.Connect.Roster.FacebookFriends extends fc.viewModels.Base 
      constructor: () ->
         super 
         @friends = ko.observableArray()
         @loading = ko.observable(false)
         @failed = ko.observable(false)
         @show_no_results = ko.observable(false)

      load: () => 
         @loadFriends()

      loadFriends: () =>
         @failed(false)
         @show_no_results(false)
         @friends([])
         fc.user.getFacebookAccessToken (err, token) =>
            return @failed(true) if err or not token
               
            @loading(true)
            fc.ajax
               url: "#{fc.getResourceURL()}/v1/me/facebook/friends?facebook_access_token=#{token}"
            , (err, friends) =>
               @loading(false)
               return @failed(true) if err

               if friends?.length > 0
                  friend.selected = ko.observable(false) for friend in friends
                  @friends(friends or [])
               else
                  @show_no_results(true)

      selectUser: (friend) -> friend.selected(not friend.selected())

      rightButtonClick: () =>
         selected = []

         for friend in @friends()
            selected.push(friend.id) if friend.selected()
         
         if selected.length == 0
            return fc.msg.show("No friends selected!")

         fc.msg.loading("Sending Roster Requests...")
         fc.ajax
            url: "#{fc.getResourceURL()}/v1/me/facebook/invite"
            type: "POST"
            data: { facebook_user_ids: selected }
         , (err, body) =>
            fc.msg.hide()
            if body?.status == "success" then fc.nav.goBack("flip")
            else fc.msg.show("Failed to send Roster Requests! Try again later.")

      shareViaTwitter: () -> fc.share.viaTwitter()
      shareViaEmail: () -> fc.share.viaEmail()
      shareViaSMS: () -> fc.share.viaSMS()
