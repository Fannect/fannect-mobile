do ($ = jQuery, ko = window.ko, fc = window.fannect) ->

   class fc.viewModels.Games.GuessTheScore extends fc.viewModels.Base 
      constructor: () ->
         super

         @game_data = new fc.models.GameData()
         @picked_at_load = ko.observable()
         @pick_set = ko.observable()
         @home_score = ko.observable()
         @away_score = ko.observable()
         @scroller_text = ko.observable("Guess the Score can only be play on game days!")
         @input_valid = ko.computed () =>
            return @home_score() >= 0 and @away_score() >= 0

         @load()

      setPick: () =>
         if @input_valid()
            @pick_set(true)

            fc.team.getActive (err, profile) =>
               return fc.msg.show("Something went wrong.. :(") if err

               @home_score(@home_score() or 0)
               @away_score(@away_score() or 0)
               forge.flurry.customEvent("Play Guess the Score")

               fc.ajax
                  url: "#{fc.getResourceURL()}/v1/me/teams/#{profile._id}/games/guessTheScore"
                  type: "POST"
                  data:
                     home_score: @home_score()
                     away_score: @away_score()
               , (err) ->
                  return fc.msg.show("Something went wrong.. :(") if err
                  fc.showScoringPopup()

      load: () =>
         fc.team.getActive (err, profile) =>
            return fc.msg.show("Unable to load game information!") if err

            fc.ajax 
               url: "#{fc.getResourceURL()}/v1/me/teams/#{profile._id}/games/guessTheScore"
               type: "GET"
               retry: "forever"
            , (error, data) =>
               return fc.msg.show("Unable to load game information!") if err
               
               @game_data.set(data)
               @picked_at_load(data.meta?.picked or false)
               @pick_set(data.meta?.picked or false)

               @home_score if @picked_at_load() then data.meta.home_score else null
               @away_score if @picked_at_load() then data.meta.away_score else null

               if not data.available
                  @picked_at_load(true)
                  @pick_set(true)
                  @home_score(0) unless @home_score()
                  @away_score(0) unless @away_score()
