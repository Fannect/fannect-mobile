do ($ = jQuery, ko = window.ko, fc = window.fannect) ->

   class fc.viewModels.Leaderboard extends fc.viewModels.Base 
      constructor: () ->
         @league_text = ko.observable("League Standings")
         super

      load: () ->
         fc.team.getActive (err, profile) =>
            if profile.is_college then @league_text("Conference Standings")
            else @league_text("League Standings")
               
            

            
