do ($ = jQuery, ko = window.ko, fc = window.fannect) ->

   class fc.viewModels.Leaderboard extends fc.viewModels.Base 
      constructor: () ->
         super
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
         @loadOverall()

      viewToggled: () =>
         @loading_more false
         @track_scrolling = false

         prev = @prev_scroll
         @prev_scroll = $(document).scrollTop()

         setTimeout () =>
            $(document).scrollTop prev
            @track_scrolling = true
         , 50

      loadOverall: (done) ->
         @loading_more true
         fc.ajax 
            url: "#{fc.getResourceURL()}/me/leaderboard?type=overall&limit=#{@limit}&skip=#{@overall_skip}"
            type: "GET"
            hide_loading: true
         , (error, fans) =>
            setTimeout (() => @loading_more(false)), 200
            @overall_skip += @limit
            @overall_fans.push fan for fan in fans
            if done then done null, fans

      loadRoster: (done) ->
         @loading_more true
         fc.ajax 
            url: "#{fc.getResourceURL()}/me/leaderboard?type=roster&limit=#{@limit}&skip=#{@roster_skip}"
            type: "GET"
            hide_loading: true
         , (error, fans) =>
            setTimeout (() => @loading_more(false)), 200
            @roster_skip += @limit
            @roster_fans.push fan for fan in fans
            if done then done null, fans

      setupInfiniteScroll: () ->
         $window = $(window).scroll () =>

            if not @loading_more() and $window.scrollTop() > $(document).height() - $window.height() - 150
               if @is_overall_selected() then @loadOverall()
               else @loadRoster()

   leftButtonClick: () ->
      if @is_roster_selected
         @selected_view "overall"
         forge.topbar.removeButtons () ->
            _createOverallButton(true)
            _createRosterButton(false)

   rightButtonClick: () ->
      if @is_roster_selected
         @selected_view "overall"
         forge.topbar.removeButtons () ->
            _createOverallButton(false)
            _createRosterButton(true)

   _createOverallButton = (active) ->
      window.fannect.mobile.addHeaderButton 
         text: "Overall"
         position: "left"
         tint: if active then [193, 39, 45, 255] else [120,120,120,255]
         click: @leftButtonClick
      
   _createRosterButton = (active) ->
      window.fannect.mobile.addHeaderButton 
         text: "Roster"
         position: "right"
         # style: if active then "done" else null
         tint: if active then [193, 39, 45, 255] else [120,120,120,255]
         click: @rightButtonClick
