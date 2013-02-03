do ($ = jQuery, ko = window.ko, fc = window.fannect) ->

   class fc.viewModels.Profile.SelectTeam.Search extends fc.viewModels.Base 
      constructor: () ->
         super 
         @limit = 20
         @skip = 0
         @query = ko.observable("")
         @teams = ko.observableArray []
         @loading_more = ko.observable false
         @show_message = ko.observable false

         @query.subscribe () =>
            @teams.removeAll()
            @skip = 0

         @load()

      load: () ->
         @show_message false
         @loading_more true

         fc.ajax 
            url: "#{fc.getResourceURL()}/v1/sports/#{fc.cache.get('sport_key')}/teams?limit=#{@limit}&skip=#{@skip}&q=#{escape(@query())}"
            type: "GET"
         , (error, teams) =>
            start = 0
            showResults = () =>
               for i in [start..start+5] by 1
                  if i >= teams.length
                     @is_loading(false)
                     return
                  start = i
                  @teams.push teams[i]
               setTimeout showResults, 5

            showResults()

            setTimeout () => 
               @loading_more false
               @show_message(true) if teams.length == 0 
            , 150

            @skip += @limit
            @teams.push t for t in teams

      onPageShow: () =>
         $window = $(window).scroll () =>
            if not @loading_more() and $window.scrollTop() > $(document).height() - $window.height() - 150
               @loading_more true
               @load()
         
      onPageHide: () =>
         $(window).unbind("scroll")

      selectTeam: (data) -> 
         fc.team.create data._id, (err) ->
            if err?.reason == "duplicate"
               fc.msg.show("You're already a commit fan of #{data.full_name}!")
            else
               $.mobile.changePage "profile.html", transition: "slideup"

            