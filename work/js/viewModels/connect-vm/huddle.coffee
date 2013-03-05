do ($ = jQuery, ko = window.ko, fc = window.fannect) ->

   class fc.viewModels.Connect.Huddle extends fc.viewModels.Base 

      constructor: () ->
         super
         @limit = 20
         @skip = 0
         @no_more_results = false
         @track_scrolling = true

         @huddles = ko.observableArray()
         @loading_more = ko.observable false
   
         # reload results if team profile changes
         fc.team.onActiveChanged () =>
            @previous_scroll_top = 0
            @huddles.removeAll()
            @skip = 0
            @no_more_results = false
            @loadHuddles()
         
         # Load immediately
         @loadHuddles()
         
      loadHuddles: () =>



      load: () =>
         

      onPageHide: () =>

      sliderOptions: () =>
         return { 
            hide: @sliderHide 
            show: @sliderShow 
            count: 3 
         }
         
      # HANDLING SLIDER
      sliderHide: (index) =>

      sliderShow: (index, has_init) =>
         index++ unless @isEditable()

         if index == 0 and not has_init
            fc.team.getActive (err, profile) =>
               fc.ajax
                  url: "#{fc.getResourceURL()}/v1/teams/#{profile.team_id}?content=next_game"
                  cache: true
               , (err, next_game) =>
                  @next_game().set(next_game)
                  @next_game.valueHasMutated()

         if index == 2 and not has_init
            @events.load()

