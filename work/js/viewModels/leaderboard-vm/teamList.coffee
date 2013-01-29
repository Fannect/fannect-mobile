do ($ = jQuery, ko = window.ko, fc = window.fannect) ->

   class fc.viewModels.Leaderboard.TeamList extends fc.viewModels.Base 
      constructor: () ->
         super
         @limit = 20
         @skip = 0
         @no_more_results = false
         
         @prev_scroll = 0
         @track_scrolling = true

         @teams = ko.observableArray()
         @loading_more = ko.observable false
         @load()

      getUrl: (url) -> throw "getUrl must be overridden!"

      load: () =>
         return if @no_more_results
         @loading_more true
         @getUrl (url) =>
            fc.ajax 
               url: "#{url}?limit=#{@limit}&skip=#{@skip}"
               type: "GET"
            , (error, teams) =>
               setTimeout (() => @loading_more(false)), 200
               
               if teams.length > 0
                  @skip += @limit
                  @teams.push team for team in teams
               else
                  @no_more_results = true
            return true

      onPageShow: () ->
         $window = $(window).scroll () =>
            if not @loading_more() and not @no_more_results and $window.scrollTop() > $(document).height() - $window.height() - 150
               @load()

      onPageHide: () => $(window).unbind("scroll")
      # selectUser: (data) -> fc.user.view(data._id)
