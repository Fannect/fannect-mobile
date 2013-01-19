do ($ = jQuery, ko = window.ko, fc = window.fannect) ->

   class fc.viewModels.Games.GameFace
      constructor: () ->
         super
         @face_value = ko.observable("off")
         @face_on = ko.computed () => @face_value()?.toLowerCase() == "on"
         @available = ko.observable false
         @face_on.subscribe (newValue) ->
            #ajax call
            
      load: (done) ->
         fc.ajax 
            url: "#{fc.getResourceURL()}/me/games/gameFace"
            type: "GET"
         , (error, data) =>
            if data.available
               @available true
               @face_value data?.face_value
            else 
               @available false
               @face_value "off"

            @home_team = data.home.name
            @home_record = data.home.record
            @away_team = data.away.name
            @away_record = data.away.record
            done null, data