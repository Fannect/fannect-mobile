do ($ = jQuery, ko = window.ko, fc = window.fannect) ->

   class fc.viewModels.Profile.ChooseWebImage extends fc.viewModels.Base 
      constructor: () ->
         super
         @limit = 20
         @skip = 0
         @has_searched = false
         @timeoutId = null
         @selected = false
         
         @loading_more = ko.observable false
         @images = ko.observableArray []
         @query = ko.observable()

         @query.subscribe () => @images.removeAll()

      search: () ->
         @skip = 0
         @images.removeAll()

         if @query().length > 0 then @loadImages @query()
         else @has_searched = false

      onPageShow: () =>
         $window = $(window).bind "scroll.chooseWebImage", () =>
            if @has_searched and not @loading_more() and $window.scrollTop() > $(document).height() - $window.height() - 150
               @loadImages @query()

      onPageHide: () =>
         $(window).unbind("scroll.chooseWebImage")

      loadImages: (query, done) ->
         @loading_more true

         fc.ajax 
            url: "#{fc.getResourceURL()}/v1/images/bing?q=#{escape(query)}&limit=#{@limit}&skip=#{@skip}"
            type: "GET"
         , (error, data) =>
            if query == @query()
               setTimeout (() => @loading_more(false)), 200 # wait for images to load fully
               @has_searched = true
               @skip += @limit
               for image in data
                  image.selected = ko.observable(false)
                  @images.push image 

               done null, data if done

      select: (data, event) =>
         if not @selected
            @selected = true
            @images()[@images.indexOf(data)].selected(true)
            fc.msg.loading("Uploading image...")

            fc.team.getActive (err, profile) =>
               fc.ajax 
                  url: "#{fc.getResourceURL()}/v1/images/me/#{profile._id}"
                  type: "POST"
                  data: image_url: data.url
               , (err, data) =>
                  fc.msg.hide()

                  if err
                     fc.msg.show("Unable to upload image due to copyright.")
                     @selected = false
                     @images()[@images.indexOf(data)].selected(false)
                  else
                     fc.team.updateActive(data)
                     $.mobile.changePage "profile.html", 
                        transition: "slidedown"
                        reverse: true
