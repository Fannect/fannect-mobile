do ($ = jQuery, ko = window.ko, fc = window.fannect) ->

   class fc.viewModels.Leaderboard extends fc.viewModels.Base 
      constructor: () ->
         @is_college = ko.observable()
         super

         fc.team.getActive (err, profile) =>
            @is_college(profile.is_college)
