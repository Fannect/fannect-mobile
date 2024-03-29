do ($ = jQuery, ko = window.ko, fc = window.fannect) ->

   class fc.viewModels.Profile.SelectTeam.ChooseTeam extends fc.viewModels.Base 
      constructor: () ->
         super          
         @teams = ko.observableArray []
         @is_loading = ko.observable(true)
         
      load: () =>
         # Return if user has not selected a sport
         unless (@params.sport_key and @params.league_key)
            return $.mobile.changePage "profile-selectTeam.html", transition:"none"

         fc.ajax 
            url: "#{fc.getResourceURL()}/v1/sports/#{@params.sport_key}/leagues/#{@params.league_key}/teams"
            type: "GET"
         , (error, teams) =>
            start = 0
            showResults = () =>
               for i in [start...start+5] by 1
                  start = i
                  if i >= teams.length
                     @is_loading(false)
                     return
                  @teams.push teams[i]
               start++
               setTimeout showResults, 5

            showResults()
            
      selectTeam: (data) -> 
         fc.msg.loading("Creating profile...")
         fc.logger.log("Creating team profile: #{data?._id}")
         return unless data?._id
         
         fc.team.create data._id, (err) ->
            fc.msg.hide()
            if err?.reason == "duplicate"
               fc.msg.show("You're already a commit fan of #{data.full_name}!")
            else
               fc.nav.changeActiveHistoryOrBack("profile", transition:"slidedown")
               
      onPageHide: () => @teams.removeAll()