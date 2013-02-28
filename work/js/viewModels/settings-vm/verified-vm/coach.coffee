do ($ = jQuery, ko = window.ko, fc = window.fannect) ->

   fc.viewModels.Settings.Verified = {} unless fc.viewModels.Settings.Verified

   class fc.viewModels.Settings.Verified.Coach extends fc.viewModels.Base 
      constructor: () ->
         @sport = ko.observable()
         @teams = ko.observable()
         super

      send: () =>
         fc.msg.loading("Sending...")

         fc.ajax
            url: "#{fc.getResourceURL()}/v1/me/verified"
            type: "POST"
            data: 
               type: "Coach"
               sport: @sport()
               teams: @teams()
         , (err, resp) ->
            fc.msg.hide()
            if resp?.status == "success"
               fc.msg.show("Your request has been received!")
            else
               fc.msg.show("Failed to send your request at this time. Please try again later!")
