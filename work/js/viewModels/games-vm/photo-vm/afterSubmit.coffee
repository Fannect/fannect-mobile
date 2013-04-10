do ($ = jQuery, ko = window.ko, fc = window.fannect) ->

   class fc.viewModels.Games.AfterSubmit extends fc.viewModels.Base 
      constructor: () ->
         super
         @highlight = null
         @go_back = false

         @shared_twitter = ko.observable(false)
         @shared_facebook = ko.observable(false)
         @shared_sms = ko.observable(false)
         
         # reload results if team profile changes
         fc.team.onActiveChanged () => @go_back = true
         
      uploadMore: () =>
         fc.nav.goBack()
      
      viewAll: () =>
         fc.nav.clearHistory("games")
         fc.nav.buildHistory("connect", [  
            new fc.nav.HistoryEntry("connect-highlights.html", "slide")
         ], { transition: "slidedown", params: { created_by: @params.type } })

      load: () => @highlight = @params.highlight
         
      shareViaTwitter: () =>
         return if @shared_twitter()
         @shared_twitter(true)
         fc.user.linkTwitter (err, success) =>
            unless success
               @shared_twitter(false)
               return 
            fc.ajax
               url: "#{fc.getResourceURL()}/v1/highlights/@highlight.id}/share"
               type: "POST"
               data: 
                  twitter: "true"
                  caption: @highlight.caption

      shareViaFacebook: () =>
         return if @shared_facebook()
         @shared_facebook(true)
         forge.facebook.ui
            method: "feed"
            name: "Fan Highlight"
            description: @highlight.caption
            link: "http://fans.fannect.me/#{@highlight.short_id}"
            picture: "#{@highlight.image_url}"
         , (data) =>
            @shared_facebook(false)
         , (err) =>
            @shared_facebook(false)

      shareViaSMS: () =>
         return if @shared_sms()
         @shared_sms(true)
         forge.sms.send
            body: "#{@highlight.caption} http://fans.fannect.me/#{@highlight.short_id}"
            to: []
         , (data) => 
            @shared_sms(false)
         , (err) => 
            @shared_sms(false)