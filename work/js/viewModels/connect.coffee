do ($ = jQuery, ko = window.ko, fc = window.fannect) ->
   
   class fc.viewModels.Connect extends fc.viewModels.Base 
      constructor: () ->
         super 
         @limit = 20
         @skip = 0
         @query = ko.observable(fc.cache.get("last_connect_search") or "")
         @fans = ko.observableArray []
         @loading_more = ko.observable false
         @show_sharing = ko.observable false
         @show_roster_title = ko.observable(@query().length == 0)

         if not forge.is.android()
            @query.subscribe () =>
               @show_sharing(false)
               @show_roster_title(false)
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

      load: () =>
         @loading_more true

         finished = (err, fans) =>
            return if err
            setTimeout () => 
               @loading_more false
               @show_roster_title(@fans().length > 0 && @query().length == 0)
               @show_sharing(@fans().length == 0)
            , 200

            @skip += @limit
            @fans.push fan for fan in fans
            
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
         
      onPageHide: () => $(window).unbind("scroll")
      selectUser: (data) -> fc.user.view(team_profile_id: data._id)
      rightButtonClick: () -> $.mobile.changePage "share.html", transition: "slide"
      shareViaTwitter: () -> fc.share.viaTwitter()
      shareViaEmail: () -> fc.share.viaEmail()
      shareViaSMS: () -> fc.share.viaSMS()
