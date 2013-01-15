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
               @load true, () => @loading_more false

         @load false, (err, data) =>
            done err, @

      load: (hide_loading, done) ->
         fc.ajax 
            url: "#{fc.getResourceURL()}/me/connect?limit=#{@limit}&skip=#{@skip}"
            type: "GET"
            hide_loading: hide_loading
         , (error, data) =>
            @skip += @limit
            @fans.push fan for fan in data
            done null, data if done

      # scrolled: (data, e) ->
      #    console.log "SCROLL", e
      #    elem = e.target
         