do ($ = jQuery, ko = window.ko, fc = window.fannect) ->

   class fc.viewModels.Profile.SelectTeam.ChooseLeague extends fc.viewModels.Base 
      constructor: () ->
         super 
         @is_loading = ko.observable(true)
         @leagues = ko.observableArray []
      
      load: () =>
         # Return if user has not selected a sport
         unless @params.sport_key
            return $.mobile.changePage "profile-selectTeam.html", transition: "none"
         
         fc.ajax 
            url: "#{fc.getResourceURL()}/v1/sports/#{@params.sport_key}/leagues"
            type: "GET"
         , (error, leagues) =>
            @is_loading(false)
            @leagues.push league for league in leagues
            
      onPageHide: () => @leagues.removeAll()