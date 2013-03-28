do ($ = jQuery, ko = window.ko, fc = window.fannect) ->

   class fc.viewModels.Connect.Highlights.Comments extends fc.viewModels.Base 

      constructor: () ->
         super
         @highlight = null
         @comments = ko.observableArray()
         @loading_more = ko.observable(false)
         @has_more = ko.observable(true)
         @go_back = false
         @skip = 0
         @limit = 10
   
         # reload results if team profile changes
         fc.team.onActiveChanged () => @go_back = true

      load: () =>
         return fc.nav.backToRoot("connect") unless @params?.highlight?

         if @go_back
            @go_back = false
            return fc.nav.goBack()

         if @highlight?._id != @params.highlight._id
            @highlight = @params.highlight
            
            if @highlight.comments?.length > 5
               @comments(@highlight.comments)
               @skip = @highlight.comments.length
            else
               @comments.removeAll()
               skip = 0
               @loadComments()

      loadComments: () =>
         return unless @has_more()
         @loading_more(true)

         fc.ajax 
            url: "#{fc.getResourceURL()}/v1/hightlights/#{@highlight._id}/comments?limit=#{@limit}&skip=#{@skip}"
            type: "GET"
         , (err, comments) =>
            setTimeout (() => @loading_more(false)), 200
            return fc.msg.show("Unable to load comments!") if err
            @has_more(comments.length == @limit)
            @comments.push(comment) for comment in comments
            @skip += @limit

      onPageShow: () =>
         $window = $(window).bind "scroll.highlightcomments", () =>
            if not @loading_more() and @has_more() and $window.scrollTop() > $(document).height() - $window.height() - 150
               @loadComments()

      onPageHide: () => $(window).unbind("scroll.highlightcomments")
            