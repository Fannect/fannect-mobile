do ($ = jQuery, ko = window.ko, fc = window.fannect) ->

   class fc.viewModels.Profile.Invitations extends fc.viewModels.Base 
      constructor: () ->
         super
         @invitations = ko.observableArray()
         @load()

      load: (done) ->
         fc.ajax 
            url: "#{fc.getResourceURL()}/me/invitations"
            method: "GET"
         , (error, data) ->
            @invitations.push inv for inv in data
            done null, data