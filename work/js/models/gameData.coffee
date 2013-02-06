do ($ = jQuery, ko = window.ko, fc = window.fannect) ->

   fc.models = {} unless fc.models

   class fc.models.GameData

      constructor: (data) ->
         @available = ko.observable()
         @next_game = ko.observable()
         @coverage = ko.observable()
         @game_preview = ko.observable()
         @home_team = ko.observable
            name: "Unknown"
            record: ""
         @away_team = ko.observable
            name: "Unknown"
            record: ""
         @stadium = ko.observable
            name: null
            location: null
         @no_game_scheduled = ko.computed () => @away_team()?.name == "Unknown" or @next_game() == "TBD"

         @set(data) if data

      set: (data) ->
         @available data.available or false
         @game_preview data.preview
         @next_game if data.game_time then dateFormat(new Date(data.game_time), "ddd, mmmm dS, h:MM TT") else "TBD"

         if data.away_team
            away = { name: "Unknown", record: "" } 
            $.extend away, data.away_team
            @away_team away
         
         if data.home_team
            home = { name: "Unknown", record: "" } 
            $.extend home, data.home_team
            @home_team home
         
         if data.stadium 
            stadium = { name: "Unknown", location: "Unknown" } 
            $.extend stadium, data.stadium
            @stadium stadium