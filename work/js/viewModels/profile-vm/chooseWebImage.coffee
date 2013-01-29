do ($ = jQuery, ko = window.ko, fc = window.fannect) ->

   class fc.viewModels.Profile.ChooseWebImage extends fc.viewModels.Base 
      constructor: () ->
         super
         @limit = 20
         @skip = 0
         @has_loaded = false
         @timeoutId = null
         @selected_index = -1
         
         @loading_more = ko.observable false
         @images = ko.observableArray []
         @query = ko.observable()

         # @query.subscribe () =>
         #    if @timeoutId then clearTimeout @timeoutId
         #    @timeoutId = setTimeout () =>
         #       @timeoutId = null
         #       @search()
         #    , 400

      search: () ->
         @skip = 0
         @images.removeAll()

         if @query().length > 0 then @load @query()
         else @has_loaded = false

      onPageShow: () =>
         $window = $(window).scroll () =>
            if @has_loaded and not @loading_more() and $window.scrollTop() > $(document).height() - $window.height() - 150
               @load @query()

      onPageHide: () =>
         $(window).unbind("scroll")

      load: (query, done) ->
         @loading_more true
         fc.ajax 
            url: "#{fc.getResourceURL()}/v1/images/bing?q=#{escape(query)}&limit=#{@limit}&skip=#{@skip}"
            type: "GET"
            hide_loading: true
         , (error, data) =>
            if query == @query()
               setTimeout (() => @loading_more(false)), 200 # wait for images to load fully
               @has_loaded = true
               @skip += @limit
               for image in data
                  image.selected = ko.observable(false)
                  @images.push image 

               done null, data if done

      select: (data, event) =>
         if @selected_index >= 0 
            @images()[@selected_index].selected(false)

         @selected_index = @images.indexOf(data)

         if @selected_index >= 0 
            @images()[@selected_index].selected(true)

      rightButtonClick: () =>
         if @selected_index >= 0
            image = @images()[@selected_index].url
            fc.team.getActive (err, profile) =>
               fc.ajax 
                  url: "#{fc.getResourceURL()}/v1/images/me/#{profile._id}"
                  type: "POST"
                  data: image_url: @images()[@selected_index].url
               , (err, data) =>
                  fc.team.updateActive(data)