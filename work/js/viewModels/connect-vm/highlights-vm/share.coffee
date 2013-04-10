do ($ = jQuery, ko = window.ko, fc = window.fannect) ->

   class fc.viewModels.Connect.Highlights.Share extends fc.viewModels.Base 

      constructor: () ->
         super
         @highlight = ko.observable()
         @go_back = false
         @share_caption = ko.observable("")

         @shared_twitter = ko.observable(false)
         @shared_facebook = ko.observable(false)
         @shared_sms = ko.observable(false)
         
         # reload results if team profile changes
         fc.team.onActiveChanged () => @go_back = true

      load: () =>
         return fc.nav.backToRoot("connect") unless @params?.highlight? or @highlight?

         if @go_back
            @go_back = false
            return fc.nav.goBack()

         @highlight(@params.highlight) if @params.highlight
         
         # preset caption
         if @highlight()
            @share_caption(@highlight().caption)

      shareViaTwitter: () =>
         return if @shared_twitter()
         @shared_twitter(true)
         fc.user.linkTwitter (err, success) =>
            unless success
               @shared_twitter(false)
               return 
            fc.ajax
               url: "#{fc.getResourceURL()}/v1/highlights/#{@highlight()._id}/share"
               type: "POST"
               data: 
                  twitter: true
                  caption: @share_caption()

      shareViaFacebook: () =>
         return if @shared_facebook()
         @shared_facebook(true)
         forge.facebook.ui
            method: "feed"
            name: "Fan Highlight"
            description: @share_caption()
            link: "http://fans.fannect.me/#{@highlight().short_id}"
            picture: "#{@highlight().image_url}"
         , (data) =>
            @shared_facebook(false)
         , (err) =>
            @shared_facebook(false)

      shareViaSMS: () =>
         return if @shared_sms()
         @shared_sms(true)
         forge.sms.send
            body: "#{@share_caption()} http://fans.fannect.me/#{@highlight().short_id}"
            to: []
         , (data) => 
            @shared_sms(false)
         , (err) => 
            @shared_sms(false)

