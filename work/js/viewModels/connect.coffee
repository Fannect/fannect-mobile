do ($ = jQuery, ko = window.ko, fc = window.fannect) ->

   class fc.viewModels.Connect
      constructor: (done) ->
         @limit = 20
         @skip = 0
         @fans = ko.observableArray []
         @loading_more = ko.observable false

         $window = $(window).scroll () =>
            if $window.scrollTop() > $(document).height() - $window.height() - 150
               @loading_more true
               @load()

         @load (err, data) =>
            done err, @

      load: (done) ->
         @loading_more true
         fc.ajax 
            url: "#{fc.getResourceURL()}/me/connect?limit=#{@limit}&skip=#{@skip}"
            type: "GET"
            hide_loading: true
         , (error, data) =>
            setTimeout (() => @loading_more(false)), 200
            @skip += @limit
            @fans.push fan for fan in data
            done null, data if done

      # scrolled: (data, e) ->
      #    console.log "SCROLL", e
      #    elem = e.target
         