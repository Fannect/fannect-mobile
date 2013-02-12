do ($ = jQuery, ko = window.ko, fc = window.fannect) ->

   class fc.viewModels.Profile.SelectTeam.Search extends fc.viewModels.Base 
      constructor: () ->
         super 
         @limit = 30
         @skip = 0
         @query = ko.observable("")
         @teams = ko.observableArray []
         @loading_more = ko.observable false

         @query.subscribe () =>
            if @timeoutId then clearTimeout @timeoutId
            @timeoutId = setTimeout () =>
               @timeoutId = null
               @search()
            , 400

         @load()

      search: () =>
         @skip = 0
         @teams.removeAll()
         @load()

      load: () =>
         return unless @query()?.length > 0
         @loading_more true

         fc.ajax 
            url: "#{fc.getResourceURL()}/v1/sports/#{fc.cache.get('sport_key')}/teams?limit=#{@limit}&skip=#{@skip}&q=#{escape(@query())}"
            type: "GET"
         , (err, teams) =>
            return fc.msg.show("Unable to load teams!") if err
            @skip += @limit
            @teams.push t for t in teams

      onPageShow: () =>
         super
         $window = $(window).scroll () =>
            if not @loading_more() and $window.scrollTop() > $(document).height() - $window.height() - 150
               @loading_more true
               @load()
         
      onPageHide: () =>
         super
         $(window).unbind("scroll")

      selectTeam: (data) -> 
         fc.msg.loading("Creating profile...")
         fc.team.create data._id, (err) ->
            fc.msg.hide()
            if err?.reason == "duplicate"
               fc.msg.show("You're already a commit fan of #{data.full_name}!")
            else
               $.mobile.changePage "profile.html", fc.transition("slideup")

            