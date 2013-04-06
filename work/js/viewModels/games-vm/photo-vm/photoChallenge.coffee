do ($ = jQuery, ko = window.ko, fc = window.fannect) ->
   
   class fc.viewModels.Games.PhotoChallenge extends fc.viewModels.Games.PhotoBase 
      constructor: () ->
         super
         @game_type("photo_challenge")
         @challenge_title = ko.observable("Photo Challenge")
         @challenge_description = ko.observable("Loading this weeks challenge...")

      load: () =>
         super
         fc.team.getActive (err, profile) ->
            fc.ajax
               url: "#{fc.getResourceURL()}/v1/me/teams/#{profile._id}/games/photo_challenge"
               type: "GET"
            , (err, data) ->
               return if err or data?.status == "fail"
               @challenge_title(data.meta.challenge_title)
               @challenge_description(data.meta.challenge_description)
