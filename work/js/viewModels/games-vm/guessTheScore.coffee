do ($ = jQuery, ko = window.ko, fc = window.fannect) ->

   class fc.viewModels.Games.GuessTheScore extends fc.viewModels.Base 
      constructor: () ->
         super
         @available = ko.observable()
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
         fc.team.getActive (err, profile) =>
            return fc.msg.show("Unable to load game information!") if err

            fc.ajax 
               url: "#{fc.getResourceURL()}/v1/me/teams/#{profile._id}/games/guessTheScore/mock0"
               type: "GET"
            , (error, data) =>
               return fc.msg.show("Unable to load game information!") if err
               
               @available data.available

               @picked_at_load(data.meta?.picked or false)
               @pick_set(data.meta?.picked or false)

               @home_score if @picked_at_load() then data.meta.home_score else null
               @away_score if @picked_at_load() then data.meta.away_score else null
               @home_team data.home_team?.name
               @home_record data.home_team?.record
               @away_team data.away_team?.name
               @away_record data.away_team?.record
               @game_preview data.preview

               @input_valid = ko.computed () =>
                  return @home_score() >= 0 and @away_score() >= 0