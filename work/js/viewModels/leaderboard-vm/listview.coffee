do ($ = jQuery, ko = window.ko, fc = window.fannect) ->

   class fc.viewModels.Leaderboard.ListView extends fc.viewModels.Base 
      constructor: () ->
         super
         @limit = 20
         @skip = 0
         @no_more_results = false
         @track_scrolling = true

         @items = ko.observableArray()
         @loading_more = ko.observable false
   
         # reload results if team profile changes
         fc.team.onActiveChanged () =>
            @previous_scroll_top = 0
            @items.removeAll()
            @skip = 0
            @no_more_results = false
            @loadFans()
         
         # Load immediately
         @loadFans()


      getUrl: (url) -> throw "getUrl must be overridden!"
      getItemTemplate: () -> return "getItemTemplate must be overridden!"
      getListViewClass: () -> return "getListViewClass must be overridden!"
      extractList: (data) -> return data
      
      loadFans: () =>
         return if @no_more_results
         @loading_more(true)
         @getUrl (url) =>
            fc.ajax 
               url: "#{url}#{if url.indexOf('?') >= 0 then '&' else '?' }limit=#{@limit}&skip=#{@skip}"
               type: "GET"
               retry: "forever"
            , (error, result) =>
               setTimeout (() => @loading_more(false)), 200
               
               items = @extractList(result)

               if items.length > 0
                  @no_more_results = items.length < @limit
                  @skip += @limit
                  @items.push team for team in items
               else
                  @no_more_results = true
            return true

      onPageShow: () ->
         $window = $(window).bind "scroll.leaderboard", () =>
            if not @loading_more() and not @no_more_results and $window.scrollTop() > $(document).height() - $window.height() - 150
               @loadFans()

      onPageHide: () => $(window).unbind("scroll.leaderboard")

      selectUser: (data) -> 
         $.mobile.changePage "profile-other.html?team_profile_id=#{data._id}", transition:"slide"
      selectTeam: (data) -> 
         $.mobile.changePage "leaderboard-breakdownOther.html?team_id=#{data._id}", transition:"slide"