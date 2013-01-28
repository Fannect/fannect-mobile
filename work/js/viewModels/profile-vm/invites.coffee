do ($ = jQuery, ko = window.ko, fc = window.fannect) ->

   class fc.viewModels.Profile.Invites extends fc.viewModels.Base 
      constructor: () ->
         super
         @invites = ko.observableArray()
         @no_invites = ko.observable(false)
         @load()

      load: () ->
         fc.ajax 
            url: "#{fc.getResourceURL()}/v1/me/invites"
            method: "GET"
         , (error, data) =>
            if data.length < 0
               @invites.push inv for inv in data
            else
               @no_invites(true)