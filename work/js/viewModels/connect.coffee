do ($ = jQuery, ko = window.ko, fc = window.fannect) ->

   class fc.viewModels.Connect extends fc.viewModels.Base 
      constructor: () ->
         super 
         @limit = 20
         @skip = 0
         @query = ko.observable("")
         @fans = ko.observableArray []
         @loading_more = ko.observable false
         @show_message = ko.observable false

         @query.subscribe () =>
            @fans.removeAll()
            @skip = 0

         @load()

      load: (done) ->
         @show_message false
         @loading_more true
         fc.ajax 
            url: "#{fc.getResourceURL()}/v1/teams/#{fc.team.getActiveTeamId()}/users?limit=#{@limit}&skip=#{@skip}&q=#{@query()}"
            type: "GET"
            hide_loading: true
         , (error, fans) =>
            setTimeout () => 
               @loading_more false
               @show_message(true) if @query().length == 0 and fans.length == 0 
            , 150

            @skip += @limit
            @fans.push fan for fan in fans
            done null, fans if done

      onPageShow: () =>
         $window = $(window).scroll () =>
            if not @loading_more() and $window.scrollTop() > $(document).height() - $window.height() - 150
               @loading_more true
               @load()
         
      onPageHide: () =>
         $(window).unbind("scroll")

      selectUser: (data) -> 
         fc.user.view(data._id)