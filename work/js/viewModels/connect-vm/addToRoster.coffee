do ($ = jQuery, ko = window.ko, fc = window.fannect) ->
   
   class fc.viewModels.Connect.AddToRoster extends fc.viewModels.Base 
      constructor: () ->
         super
         @roster_fans = ko.observableArray [] data.fans
         @load()
            
      load: (done) ->
         fc.ajax 
            url: "#{fc.getResourceURL()}/api/connect/addToRoster"
            method: "GET"
         , (error, data) ->
            @roster_fans.push fan for fan in data
            done null, data

