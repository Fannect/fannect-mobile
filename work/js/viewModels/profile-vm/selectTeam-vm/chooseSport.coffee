do ($ = jQuery, ko = window.ko, fc = window.fannect) ->

   class fc.viewModels.Profile.SelectTeam.ChooseSport extends fc.viewModels.Base 
      constructor: () ->
         super 
         @sports = ko.observableArray []
         @is_loading = ko.observable(true)
         @load()

      load: (done) ->
         fc.ajax 
            url: "#{fc.getResourceURL()}/v1/sports"
            type: "GET"
         , (error, sports) =>
            @is_loading(false)
            @sports.push sport for sport in sports
            done null, sports if done

      onPageShow: () ->
         super
         options = fc.cache.pull("choose_team_options") or {}
         forge.topbar.removeButtons() if options.hide_back

      selectSport: (data) -> fc.cache.set("sport_key", data.sport_key)