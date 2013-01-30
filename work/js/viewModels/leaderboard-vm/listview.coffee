do ($ = jQuery, ko = window.ko, fc = window.fannect) ->

   class fc.viewModels.Leaderboard.ListView extends fc.viewModels.Base 
      constructor: () ->
         super
         @limit = 20
         @skip = 0
         @no_more_results = false
         
         @prev_scroll = 0
         @track_scrolling = true

         @items = ko.observableArray()
         @loading_more = ko.observable false
         @load()

      getUrl: (url) -> throw "getUrl must be overridden!"
      getItemTemplate: () -> return "getItemTemplate must be overridden!"
      getListViewClass: () -> return "getListViewClass must be overridden!"
      extractList: (data) -> return data

      load: () =>
         return if @no_more_results
         @loading_more(true)
         @getUrl (url) =>
            fc.ajax 
               url: "#{url}#{if url.indexOf('?') >= 0 then '&' else '?' }limit=#{@limit}&skip=#{@skip}"
               type: "GET"
            , (error, result) =>
               setTimeout (() => @loading_more(false)), 200
               
               items = @extractList(result)

               if items.length > 0
                  @no_more_results = items.length == @limit
                  @skip += @limit
                  @items.push team for team in items
               else
                  @no_more_results = true
            return true

      onPageShow: () ->
         $window = $(window).scroll () =>
            if not @loading_more() and not @no_more_results and $window.scrollTop() > $(document).height() - $window.height() - 150
               @load()

      onPageHide: () => $(window).unbind("scroll")
      # selectUser: (data) -> fc.user.view(data._id)
