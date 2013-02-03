do ($ = jQuery, ko = window.ko, fc = window.fannect) ->

   class fc.viewModels.Games.GuessTheScore extends fc.viewModels.Base 
      constructor: () ->
         super
         @picked_at_load = ko.observable()
         @pick_set = ko.observable()
         @home_score = ko.observable()
         @away_score = ko.observable()
         @home_team = ko.observable()
         @home_record = ko.observable()
         @away_team = ko.observable()
         @away_record = ko.observable()
         @game_preview = ko.observable()
         @input_valid = ko.computed () =>
            return @home_score() >= 0 and @away_score() >= 0

         @load()

      setPick: () ->
         if @input_valid()
            @pick_set true
            # send ajax call to set picked

      load: () ->
         fc.ajax 
            url: "#{fc.getResourceURL()}/v1/me/games/guessTheScore"
            type: "GET"
         , (error, data) =>
            @picked_at_load = ko.observable data.picked
            @pick_set = ko.observable data.picked

            @home_score if @picked_at_load then data.home_team.picked_score else 0
            @away_score if @picked_at_load then data.away_team.picked_score else 0
            @home_team data.home_team.name
            @home_record data.home_team.record
            @away_team data.away_team.name
            @away_record data.away_team.record
            @game_preview data.game_preview

            @input_valid = ko.computed () =>
               return @home_score() >= 0 and @away_score() >= 0