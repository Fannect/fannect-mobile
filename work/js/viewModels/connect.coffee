do ($ = jQuery, ko = window.ko, fc = window.fannect) ->

   class fc.viewModels.Connect extends fc.viewModels.Base 
      constructor: () ->
         super 
         @limit = 20
         @skip = 0
         @fans = ko.observableArray []
         @loading_more = ko.observable false
         @has_loaded = ko.observable false

         $window = $(window).scroll () =>
            if @is_showing and $window.scrollTop() > $(document).height() - $window.height() - 150
               @loading_more true
               @load()

         @load()

      load: (done) ->
         @loading_more true
         fc.ajax 
            url: "#{fc.getResourceURL()}/me/connect?limit=#{@limit}&skip=#{@skip}"
            type: "GET"
            hide_loading: true
         , (error, data) =>
            setTimeout () => 
               @has_loaded true
               @loading_more(false)
            , 200
            @skip += @limit
            @fans.push fan for fan in data
            done null, data if done

      rightButtonClick: () ->
         $.mobile.changePage "connect-addToRoster.html", transition: "slide"

      # scrolled: (data, e) ->
      #    console.log "SCROLL", e
      #    elem = e.target
         