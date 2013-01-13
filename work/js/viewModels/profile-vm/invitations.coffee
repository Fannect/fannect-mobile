do ($ = jQuery, ko = window.ko, fc = window.fannect) ->

   class fc.viewModels.Profile.Invitations
      constructor: (done) ->
         @load (err, data) =>
            @invitations = ko.observableArray data.invitations
            done err, @

      load: (done) ->
         fc.ajax 
            url: "#{fc.getResourceURL()}/me/invitations"
            method: "GET"
         , (error, data) ->
            done null, data