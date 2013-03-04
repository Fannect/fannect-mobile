do ($ = jQuery, ko = window.ko, fc = window.fannect) ->
   
   class fc.viewModels.Connect extends fc.viewModels.Base 
      constructor: () ->
         super 
         @limit = 20
         @skip = 0
         @query = ko.observable("")
         @fans = ko.observableArray []
         @loading_more = ko.observable false
         @show_sharing = ko.observable false
         @show_roster_title = ko.observable(true)
         @show_roster_empty = ko.observable(false)
         @has_more = true

         # set up instant search for everything but Androids
         if not forge.is.android()
            @query.subscribe () =>
               @show_sharing(false)
               @show_roster_title(false)
               @show_roster_empty(false)
               if @timeoutId then clearTimeout @timeoutId
               @timeoutId = setTimeout () =>
                  @timeoutId = null
                  @search()
               , 400

         # Load roster immediately
         @loadFans()

         # reload results if team profile changes
         fc.team.onActiveChanged () =>
            @previous_scroll_top = 0
            @search()

      androidSearch: () => @search() if forge.is.android()
      search: () =>
         @has_more = true
         @skip = 0
         @fans.removeAll()
         @loadFans()

      loadFans: () =>
         @loading_more true

         # use this to make sure the returned data is relevant
         cached_query = @query()

         finished = (err, fans) =>
            return if err or @query() != cached_query
            setTimeout () => 
               @loading_more false
               @show_roster_title(@fans().length > 0 && cached_query.length == 0)
               @show_roster_empty(@fans().length == 0 and cached_query.length == 0)
               @show_sharing(@fans().length == 0 and cached_query.length > 0)
            , 200

            @has_more = fans.length == @limit
            @skip += @limit
            @fans.push fan for fan in fans
            
         fc.team.getActive (err, profile) =>
            if @query()?.length > 0
               fc.ajax 
                  url: "#{fc.getResourceURL()}/v1/teams/#{profile.team_id}/users?limit=#{@limit}&skip=#{@skip}&q=#{escape(cached_query)}"
                  type: "GET"
               , finished
            else
               fc.ajax 
                  url: "#{fc.getResourceURL()}/v1/teams/#{profile.team_id}/users?limit=#{@limit}&skip=#{@skip}&friends_of=#{profile._id}"
                  type: "GET"
               , finished

      onPageShow: () =>
         $window = $(window).bind "scroll.connectpage", () =>
            if not @loading_more() and @has_more and $window.scrollTop() > $(document).height() - $window.height() - 150
               @loading_more true
               @loadFans()
         
      onPageHide: () => $(window).unbind("scroll.connectpage")
      selectUser: (data) -> $.mobile.changePage "profile-other.html?team_profile_id=#{data._id}", transition:"slide"
      rightButtonClick: () -> $.mobile.changePage "share.html", transition: "slide"
      shareViaTwitter: () -> fc.share.viaTwitter()
      shareViaEmail: () -> fc.share.viaEmail()
      shareViaSMS: () -> fc.share.viaSMS()
