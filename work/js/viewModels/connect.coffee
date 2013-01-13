do ($ = jQuery, ko = window.ko, fc = window.fannect) ->

   class fc.viewModels.Connect
      constructor: (done) ->
         @load (err, data) =>
            @roster_fans = ko.observableArray data.fans
            done err, @

      load: (done) ->
         fc.ajax 
            url: "#{fc.getResourceURL()}/me/connect"
            method: "GET"
         , (error, data) ->
            done null, data