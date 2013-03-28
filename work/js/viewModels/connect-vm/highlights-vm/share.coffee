do ($ = jQuery, ko = window.ko, fc = window.fannect) ->

   class fc.viewModels.Connect.Highlights.Share extends fc.viewModels.Base 

      constructor: () ->
         super
         @highlight = ko.observable()
         @go_back = false
         
         # reload results if team profile changes
         fc.team.onActiveChanged () => @go_back = true

      load: () =>
         return fc.nav.backToRoot("connect") unless @params?.highlight?

         if @go_back
            @go_back = false
            return fc.nav.goBack()

         @highlight(@params.highlight)

      shareViaTwitter: () =>
      shareViaFacebook: () =>
      shareViaInstagram: () =>
      shareViaEmail: () =>
