do ($ = jQuery, ko = window.ko, fc = window.fannect) ->

   class fc.viewModels.Connect.Huddle.Replies extends fc.viewModels.Base 

      constructor: () ->
         super
         @limit = 10
         @replies_pages = []
         @huddle = null
         
         @topic = ko.observable()
         @owner = ko.observable()
         @loading_more = ko.observable(false)
         @replies = ko.observableArray()
         @current_page = ko.observable(1)
         @page_count = ko.observable(1)
         @current_page_text = ko.computed () => 
            return "Page #{@current_page()}<span class='slash'>/</span>#{@page_count()}"

         @current_page.subscribe () => @loadReplies()

      loadReplies: () =>
         @replies([])

         if @replies_pages[@current_page()-1]?.length > 0
            @replies(@replies_pages[@current_page()-1])
         else
            page = @current_page()
            @loading_more(true)
            fc.ajax 
               url: "#{fc.getResourceURL()}/v1/huddles/#{@huddle._id}/replies?limit=#{@limit}&skip=#{@limit*(page-1)}"
               type: "GET"
            , (err, data) =>
               @loading_more(false)
               if err and page == @current_page()
                  fc.msg.show("Unable to load replies!") 
                  return 

               @addDateTime(reply) for reply in data.replies
                  
               # check if still on the same page   
               @replies(data.replies) if page == @current_page()
               @replies_pages[page-1] = data.replies

      load: () =>
         return fc.nav.backToRoot("connect") unless @params.huddle_id
         if @params.huddle_id != @huddle?._id
            @huddle = null
            @page_count(0)
            @loading_more(true)
            @replies([])
            @current_page(1)
            
            fc.ajax 
               url: "#{fc.getResourceURL()}/v1/huddles/#{@params.huddle_id}?limit=#{@limit}"
               type: "GET"
            , (err, huddle) =>
               @loading_more(false)
               return fc.msg.show("Failed to load replies!") if err or huddle?.status == "fail"
               @huddle = huddle
               @topic(huddle.topic)
               @owner(huddle.owner_name)
               @page_count(Math.ceil(@huddle.reply_count / @limit))
               @addDateTime(reply) for reply in huddle.replies
               if @current_page() == 1
                  @replies(huddle.replies)
               @replies_pages[0] = huddle.replies
         else if @params.new_reply
            # update with newly created reply
            reply = @addDateTime(@params.new_reply)
            if @replies_pages[@current_page()-1].length >= @limit
               # add a page
               @replies_pages.push([reply])
               @page_count(@page_count() + 1)
               @current_page(@current_page() + 1)
            else
               # append to page
               @replies_pages[@current_page()-1].push(reply)
               @replies(@replies_pages[@current_page()-1])

      rightButtonClick: () =>
         $.mobile.changePage "connect-huddle-newReply.html?huddle_id=#{@params.huddle_id}", transition: "slide"

      firstPage: () =>
         @current_page(1) if @current_page() != 1

      prevPage: () =>
         if (curr = @current_page()) > 1
            @current_page(curr - 1)

      nextPage: () =>
         if (curr = @current_page()) < @page_count()
            @current_page(curr + 1)

      lastPage: () =>
         @current_page(@page_count()) if @current_page() != @page_count()

      addDateTime: (reply) ->
         now = new Date()
         date = fc.parseId(reply._id)
         if (
            date.getMonth() == now.getMonth() and
            date.getFullYear() == now.getFullYear()
         )
            if date.getDate() == now.getDate()
               reply.date = "Today"
            else if date.getDate() == now.getDate() - 1
               reply.date = "Yesterday"
            else
               reply.date = dateFormat(date, "mm/dd/yyyy")
         else
            reply.date = dateFormat(date, "mm/dd/yyyy")

         reply.time = dateFormat(date, "h:MM TT")
         return reply