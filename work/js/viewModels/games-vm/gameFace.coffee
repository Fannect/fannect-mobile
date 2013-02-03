do ($ = jQuery, ko = window.ko, fc = window.fannect) ->

   class fc.viewModels.Games.GameFace extends fc.viewModels.Base 
      constructor: () ->
         super
         @face_value = ko.observable "off"
         @face_on = ko.computed () => @face_value()?.toLowerCase() == "on"
         @available = ko.observable false
         @home_team = ko.observable
            name: ""
            record: ""
         @away_team = ko.observable
            name: ""
            record: ""
         @face_on.subscribe (newValue) ->
            #ajax call

         @load()
            
      load: () ->
         fc.ajax 
            url: "#{fc.getResourceURL()}/v1/me/games/gameFace"
            type: "GET"
         , (error, data) =>
            if data.available
               @available true
               @face_value data?.face_value
            else 
               @available false
               @face_value "off"

            @home_team data.home_team
            @away_team data.away_team

      onPageShow: () ->
         super
         @face_value.valueHasMutated()
         @available.valueHasMutated()
         # @available true
         # @face_value "on"
         # @face_value.notifySubscribers()