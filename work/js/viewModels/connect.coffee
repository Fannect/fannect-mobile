do ($ = jQuery, ko = window.ko, fc = window.fannect) ->

   class fc.viewModels.Connect extends fc.viewModels.Base 
      constructor: () ->
         super 
         @limit = 20
         @skip = 0
         @query = ko.observable("")
         @fans = ko.observableArray []
         @loading_more = ko.observable false

         @query.subscribe () =>
            @fans.removeAll()
            @skip = 0

         @load()

      load: (done) ->
         @loading_more true

         fc.team.getActive (err, profile) =>
            fc.ajax 
               url: "#{fc.getResourceURL()}/v1/teams/#{profile.team_id}/users?limit=#{@limit}&skip=#{@skip}&q=#{escape(@query())}"
               type: "GET"
            , (error, fans) =>
               setTimeout () => 
                  @loading_more false
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