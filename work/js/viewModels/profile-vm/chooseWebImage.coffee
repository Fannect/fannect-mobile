do ($ = jQuery, ko = window.ko, fc = window.fannect) ->

   class fc.viewModels.Profile.ChooseWebImage
      constructor: (done) ->
         @limit = 20
         @skip = 0
         @has_loaded = false
         @loading_more = ko.observable false
         @images = ko.observableArray []
         @query = ko.observable()
         @timeoutId = null

         $window = $(window).scroll () =>
            if @has_loaded and not @loading_more() and $window.scrollTop() > $(document).height() - $window.height() - 150
               @load @query()

         @query.subscribe () =>
            if @timeoutId then clearTimeout @timeoutId
            @timeoutId = setTimeout () =>
               @timeoutId = null
               @search()
            , 400

         done null, @

      search: () ->
         @skip = 0
         @images.removeAll()

         if @query().length > 0 then @load @query()
         else @has_loaded = false

      load: (query, done) ->
         @loading_more true
         fc.ajax 
            url: "#{fc.getResourceURL()}/find/images?query=#{query}&limit=#{@limit}&skip=#{@skip}"
            type: "GET"
            hide_loading: true
         , (error, data) =>
            if query == @query()
               console.log "SKIP:", @skip
               setTimeout (() => @loading_more(false)), 200 # wait for images to load fully
               @has_loaded = true
               @skip += @limit
               @images.push image for image in data
               done null, data if done