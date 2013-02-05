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
            
      load: () =>
         fc.team.getActive (err, profile) =>
            return fc.msg.show("Unable to load game information!") if err
            
            fc.ajax 
               url: "#{fc.getResourceURL()}/v1/me/teams/#{profile._id}/games/gameFace/mock0"
               type: "GET"
            , (error, data) =>
               return fc.msg.show("Unable to load game information!") if err
               
               @available data.available or false
               @face_value if data?.meta?.face_value then "on" else "off"

               away = { name: "Unknown", record: "" } 
               home = { name: "Unknown", record: "" }

               $.extend home, data.home_team
               $.extend away, data.away_team

               @home_team home
               @away_team away

      onPageShow: () =>
         super
         @face_value.valueHasMutated()
         @available.valueHasMutated()
         # @available true
         # @face_value "on"
         # @face_value.notifySubscribers()