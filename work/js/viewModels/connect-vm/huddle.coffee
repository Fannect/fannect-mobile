do ($ = jQuery, ko = window.ko, fc = window.fannect) ->

   class fc.viewModels.Connect.Huddle extends fc.viewModels.Base 

      constructor: () ->
         super
         @limit = 20
         @skip = 0
         @has_more = false
         @created_by = "team"
         @sort_by = ko.observable("most_active")
         @team_name = ko.observable()
         @team_id = null

         @huddles = ko.observableArray()
         @loading_more = ko.observable false
         @sort_by.subscribe () => @reloadHuddles()
   
         fc.team.getActive (err, profile) =>
            @team_id = profile.team_id
            @team_name(profile.team_name)
            
            # Load immediately
            @loadHuddles()

         # reload results if team profile changes
         fc.team.onActiveChanged (profile) =>
            @previous_scroll_top = 0
            @team_id = profile.team_id
            @team_name(profile.team_name)
            @reloadHuddles()

      reloadHuddles: () =>
         @huddles.removeAll()
         @skip = 0
         @no_more_results = false
         @loadHuddles()
      
      loadHuddles: () =>
         sort_by = @sort_by()
         created_by = @created_by
         @loading_more(true)
         fc.ajax 
            url: "#{fc.getResourceURL()}/v1/teams/#{@team_id}/huddles?limit=#{@limit}&skip=#{@skip}&sort_by=#{sort_by}&created_by=#{created_by}"
            type: "GET"
         , (err, huddles) =>
            @loading_more(false)
            return fc.msg.show("Failed to load huddles..") if err
            return unless (sort_by == @sort_by() and created_by == @created_by)
            @skip += @limit
            @has_more = huddles.length == @limit
            @huddles.push(@addDateTime(huddle)) for huddle in huddles

      load: () =>
         @reloadHuddles() if @params.new_huddle
            
      onPageHide: () =>

      sortByOldest: () => @sort_by("oldest")
      sortByMostActive: () => @sort_by("most_active")
      sortByNewest: () => @sort_by("newest")

      # HANDLING SLIDER
      sliderOptions: () =>
         return { 
            hide: @sliderHide 
            show: @sliderShow 
            count: 4
         }
         
      sliderHide: (index) =>

      sliderShow: (index) =>
         if index == 0 and @created_by != "any"
            @created_by = "any"
            @reloadHuddles()
         else if index == 1 and @created_by != "team"
            @created_by = "team"
            @reloadHuddles()
         else if index == 2 and @created_by != "roster"
            @created_by = "roster"
            @reloadHuddles()
         else if index == 3 and @created_by != "me"
            @created_by = "me"
            @reloadHuddles()

      onPageShow: () =>
         $window = $(window).bind "scroll.huddlepage", () =>
            if not @loading_more() and @has_more and $window.scrollTop() > $(document).height() - $window.height() - 150
               @loadHuddles()
         
      onPageHide: () => $(window).unbind("scroll.huddlepage")
   
      addDateTime: (huddle) ->
         now = new Date()
         date = new Date(huddle.last_reply_time)
         if (
            date.getMonth() == now.getMonth() and
            date.getFullYear() == now.getFullYear()
         )
            if date.getDate() == now.getDate()
               huddle.date = "Today"
            else if date.getDate() == now.getDate() - 1
               huddle.date = "Yesterday"
            else
               huddle.date = dateFormat(date, "mm/dd/yyyy")
         else
            huddle.date = dateFormat(date, "mm/dd/yyyy")

         huddle.time = dateFormat(date, "h:MM TT")
         return huddle

