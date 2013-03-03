do ($ = jQuery, ko = window.ko, fc = window.fannect) ->

   class fc.viewModels.Profile.SelectTeam.ChooseSport extends fc.viewModels.Base 
      constructor: () ->
         super 
         @sports = ko.observableArray []
         @is_loading = ko.observable(true)
         fc.ajax 
            url: "#{fc.getResourceURL()}/v1/sports"
            type: "GET"
         , (error, sports) =>
            @is_loading(false)
            @sports.push sport for sport in sports
        
      onPageShow: () ->
         super
         forge.topbar.removeButtons() if @params.hide_back
