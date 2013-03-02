do ($ = jQuery, ko = window.ko, fc = window.fannect) ->

   class fc.viewModels.Profile.SelectTeam.ChooseTeam extends fc.viewModels.Base 
      constructor: () ->
         super          
         @teams = ko.observableArray []
         @is_loading = ko.observable(true)
         @load()

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

         fc.team.create data._id, (err) ->
            fc.msg.hide()
            if err?.reason == "duplicate"
               fc.msg.show("You're already a commit fan of #{data.full_name}!")
            else
               $.mobile.changePage "profile.html", transition: "slideup"

      onPageHide: () => @teams.removeAll()