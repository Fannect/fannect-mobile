do ($ = jQuery, ko = window.ko, fc = window.fannect) ->

   class fc.viewModels.Connect.Highlights.Comments extends fc.viewModels.Base 

      constructor: () ->
         super
         @highlight = null
         @comments = ko.observableArray()
         @new_comment = ko.observable("")
         @loading_more = ko.observable(false)
         @has_more = ko.observable(true)
         @go_back = false
         @skip = 0
         @limit = 10
   
         # reload results if team profile changes
         fc.team.onActiveChanged () => @go_back = true

      load: () =>
         return fc.nav.backToRoot("connect") unless (@params?.highlight? or @highlight?)

         if @go_back
            @go_back = false
            return fc.nav.goBack()

         if @params.highlight and @highlight?._id != @params.highlight._id
            @highlight = @params.highlight
            
            if @highlight.comments?.length > 5
               prepComment(c) for c in @highlight.comments
               @comments(@highlight.comments)
               @skip = @highlight.comments.length
               @has_more(true)
            else
               @comments.removeAll()
               @skip = 0
               @has_more(true)
               @loadComments()

      loadComments: () =>
         return unless @has_more()
         @loading_more(true)

         fc.ajax 
            url: "#{fc.getResourceURL()}/v1/highlights/#{@highlight._id}/comments?limit=#{@limit}&skip=#{@skip}&reverse=true"
            type: "GET"
         , (err, results) =>
            setTimeout (() => @loading_more(false)), 200
            return fc.msg.show("Unable to load comments!") if err
           
            has_results = false

            for comment in results.comments
               for c in @comments()
                  dupl = false
                  if c._id == comment._id
                     dupl = true
                     break
               continue if dupl
               has_results = true

               @comments.push(@prepComment(comment))

            @has_more(has_results and results.comments.length == @limit)
            @skip += @limit

      submitComment: () =>
         return fc.msg.show("Please enter your comment first!") if @new_comment().length < 1
         fc.team.getActive (err, profile) =>
            return if err

            new_comment = 
               owner_id: profile._id
               owner_user_id: profile.user_id
               owner_name: profile.name
               owner_verified: profile.verified
               owner_profile_image_url: profile.profile_image_url
               date_text: "Today at #{dateFormat(new Date(), "h:MM TT")}"
               content: @new_comment()
               team_id: profile.team_id
               team_name: profile.team_name

            @comments.unshift(new_comment)
            @new_comment("")

            fc.ajax
               url: "#{fc.getResourceURL()}/v1/highlights/#{@highlight._id}/comments"
               type: "POST"
               data: 
                  content: new_comment.content
                  team_profile_id: new_comment.owner_id

      fadeInComment: (element, index, data) ->
         if index == 0 then $(element).hide().fadeIn(400)

      onPageShow: () =>
         $window = $(window).bind "scroll.highlightcomments", () =>
            if not @loading_more() and @has_more() and $window.scrollTop() > $(document).height() - $window.height() - 150
               @loadComments()

      onPageHide: () => $(window).unbind("scroll.highlightcomments")

      shareHighlight: () =>
         $.mobile.changePage "connect-highlights-share.html", 
            params: { highlight: @highlight }
            transition: "slide"

      prepComment: (comment) ->
         now = new Date()
         date = fc.parseId(comment._id)
         time = dateFormat(date, "h:MM TT")
         if (
            date.getMonth() == now.getMonth() and
            date.getFullYear() == now.getFullYear()
         )
            if date.getDate() == now.getDate()
               comment.date_text = "Today at #{time}"
            else if date.getDate() == now.getDate() - 1
               comment.date_text = "Yesterday at #{time}"
            else
               comment.date_text = "#{dateFormat(date, "mm/dd/yyyy")} at #{time}"
         else
            comment.date_text = "#{dateFormat(date, "mm/dd/yyyy")} at #{time}"

         return comment


            