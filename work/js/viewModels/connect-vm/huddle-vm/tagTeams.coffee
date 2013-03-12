do ($ = jQuery, ko = window.ko, fc = window.fannect) ->

   class fc.viewModels.Connect.Huddle.TagTeams extends fc.viewModels.Base 

      constructor: () ->
         super
         @skip = 0
         @limit = 20

         @team_name = ko.observable()
         @league_name = ko.observable()
         @conference_name = ko.observable()
         @is_college = ko.observable()
         @query = ko.observable()
         @loading_more = ko.observable()
         
         @include_conference = ko.observable(false)
         @include_league = ko.observable(false)
         @selected_teams = ko.observableArray()
         @searched_teams = ko.observableArray()

         if not forge.is.android()
            @query.subscribe () =>
               if @timeoutId then clearTimeout @timeoutId
               @timeoutId = setTimeout () =>
                  @timeoutId = null
                  @search()
               , 400

      load: () =>
         fc.msg.loading("Loading team information...")
         fc.team.getActive (err, profile) =>
            fc.ajax 
               url: "#{fc.getResourceURL()}/v1/teams/#{profile.team_id}?content=full"
               type: "GET"
            , (err, team) =>
               fc.msg.hide()
               return fc.msg.show("Unable to pull team information. Please try again later.") if err or not team

               @team_name(team.full_name)
               @league_name(team.league_name)
               @conference_name(team.conference_name)
               @is_college(team.is_college or false)

         # if @params?.tagged
         #    @include_league = tagged.include_league or false 
         #    @include_conference = tagged.include_conference
         #    @selected_teams = tagged.selected_teams or []

      toggleConference: () => @include_conference(not @include_conference())
      toggleLeague: () => @include_league(not @include_league())

      deselectTeam: (team) => 
         team.selected(false)
         @selected_teams.remove(team)

      removeSelected: (element) => $el = $(element).slideUp 400, () => $el.remove()
      showSelected: (element) => 

         console.log $(element).hide().slideDown 400

      selectTeam: (team) =>
         team.selected(true)
         @selected_teams.push(team)

      androidSearch: () => @search() if forge.is.android()  
      search: () =>
         @skip = 0
         @searched_teams.removeAll()
         @loadTeams()

      loadTeams: () =>
         return unless @query()?.length > 0
         @loading_more true
         query = @query()
         fc.team.getActive (err, profile) =>
            fc.ajax 
               url: "#{fc.getResourceURL()}/v1/sports/#{profile.sport_key}/teams?limit=#{@limit}&skip=#{@skip}&q=#{escape(query)}"
               type: "GET"
            , (err, teams) =>
               @loading_more false
               return fc.msg.show("Unable to load teams!") if err
               return if query != @query()
               @skip += @limit

               for team in teams
                  is_selected = false
                  for selected in @selected_teams
                     if team._id == selected._id
                        is_selected = true
                        break
                  team.selected = ko.observable(false) unless is_selected
                  @searched_teams.push(team)

      onPageShow: () =>
         super
         $window = $(window).bind "scroll.tagTeams", () =>
            if not @loading_more() and $window.scrollTop() > $(document).height() - $window.height() - 150
               @loadTeams()
         
      onPageHide: () =>
         super
         $(window).unbind("scroll.tagTeams")
         @query("")