do ($ = jQuery, ko = window.ko, fc = window.fannect) ->
   
   class fc.viewModels.Connect extends fc.viewModels.Base 
      constructor: () ->
         super 
         @limit = 20
         @skip = 0
         @query = ko.observable(fc.cache.get("last_connect_search") or "")
         @fans = ko.observableArray []
         @loading_more = ko.observable false

         if not forge.is.android()
            @query.subscribe () =>
               if @timeoutId then clearTimeout @timeoutId
               @timeoutId = setTimeout () =>
                  @timeoutId = null
                  @search()
               , 400

         @load()

      androidSearch: () => @search() if forge.is.android()
      search: () =>
         @skip = 0
         @fans.removeAll()
         fc.cache.set("last_connect_search", @query())
         @load()

      load: (done) =>
         @loading_more true

         finished = (error, fans) =>
            setTimeout () => 
               @loading_more false
            , 200

            @skip += @limit
            @fans.push fan for fan in fans
            done null, fans if done

         fc.team.getActive (err, profile) =>
            if @query()?.length > 0
               fc.ajax 
                  url: "#{fc.getResourceURL()}/v1/teams/#{profile.team_id}/users?limit=#{@limit}&skip=#{@skip}&q=#{escape(@query())}"
                  type: "GET"
               , finished
            else
               fc.ajax 
                  url: "#{fc.getResourceURL()}/v1/teams/#{profile.team_id}/users?limit=#{@limit}&skip=#{@skip}&friends_of=#{profile._id}"
                  type: "GET"
               , finished

      onPageShow: () =>
         $window = $(window).scroll () =>
            if not @loading_more() and $window.scrollTop() > $(document).height() - $window.height() - 150
               @loading_more true
               @load()
         
      onPageHide: () =>
         $(window).unbind("scroll")

      selectUser: (data) -> fc.user.view(team_profile_id: data._id)