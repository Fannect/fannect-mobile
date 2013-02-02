do ($ = jQuery, ko = window.ko, fc = window.fannect) ->

   class fc.viewModels.Leaderboard.MyRoster extends fc.viewModels.Leaderboard.ListView

      getItemTemplate: () -> return "leaderboard-fan-template"
      getListViewClass: () -> return "fans"
      extractList: (data) -> 
         for d in data
            d.profile.profile_image_url = "images/fannect_UserPlaceholderPic@2x.png" unless d.profile_image_url?.length > 2
         
         return data
      getUrl: (done) -> 
         fc.team.getActive (err, profile) ->
            done "#{fc.getResourceURL()}/v1/leaderboard/users/#{profile.team_id}?friends_of=#{profile._id}"

      