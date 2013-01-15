do ($ = jQuery, ko = window.ko, fc = window.fannect) ->

   class fc.viewModels.Leaderboard
      constructor: (done) ->
         @limit = 20
         @overall_skip = 0
         @roster_skip = 0

         @prev_scroll = 0
         @track_scrolling = true

         @selected_view = ko.observable "overall"
         @selected_view.subscribe @viewToggled
         @is_overall_selected = ko.computed () => return @selected_view() == "overall"
         @is_roster_selected = ko.computed () => return @selected_view() == "roster"
         @roster_fans = ko.observableArray()
         @overall_fans = ko.observableArray()
         @loading_more = ko.observable false

         @setupInfiniteScroll()

         @loadRoster()
         @loadOverall false, (err, data) => done err, @

      viewToggled: () =>
         @loading_more false
         @track_scrolling = false

         prev = @prev_scroll
         @prev_scroll = $(document).scrollTop()

         setTimeout () =>
            $(document).scrollTop prev
            @track_scrolling = true
         , 50

      loadOverall: (hide_loading, done) ->
         fc.ajax 
            url: "#{fc.getResourceURL()}/me/leaderboard?type=overall&limit=#{@limit}&skip=#{@overall_skip}"
            type: "GET"
            hide_loading: hide_loading
         , (error, fans) =>
            @overall_skip += @limit
            @overall_fans.push fan for fan in fans
            if done then done null, fans

      loadRoster: (hide_loading, done) ->
         fc.ajax 
            url: "#{fc.getResourceURL()}/me/leaderboard?type=roster&limit=#{@limit}&skip=#{@roster_skip}"
            type: "GET"
            hide_loading: hide_loading
         , (error, fans) =>
            @roster_skip += @limit
            @roster_fans.push fan for fan in fans
            if done then done null, fans

      setupInfiniteScroll: () ->
         $window = $(window).scroll () =>

            if not @loading_more() and $window.scrollTop() > $(document).height() - $window.height() - 150
               @loading_more true
               
               if @is_overall_selected()
                  @loadOverall true, () => @loading_more false
               else
                  @loadRoster true, () => @loading_more false
