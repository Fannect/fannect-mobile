do ($ = jQuery, ko = window.ko, fc = window.fannect) ->

   class fc.viewModels.Profile.Invites extends fc.viewModels.Base 
      constructor: () ->
         super
         @invites = ko.observableArray()
         @no_invites = ko.observable(false)
         @load()

      load: () ->
         @loading = true
         loadedTeams = null
         loadedInvites = null

         @_loadTeams (err, teams) => 
            if loadedInvites then @_setInvites(teams, loadedInvites)
            else loadedTeams = teams
         @_loadInvites (err, invs) =>
            if loadedTeams then @_setInvites(loadedTeams, invs)
            else loadedInvites = invs

      onPageShow: () =>
         @load() unless @loading


      selectUser: (data) -> fc.user.view({ user_id: data._id, action: "accept" })
      hideInvite: (element) -> $el = $(element).slideUp 400, () -> $el.remove()
      removeInvite: (data) =>
         @invites.remove(data)
         fc.ajax
            url: "#{fc.getResourceURL()}/v1/me/invites"
            type: "DELETE"
            data: user_id: data._id
         , (err) => throw(err) if err

      acceptInvite: (data) =>
         @invites.remove(data)
         fc.ajax
            url: "#{fc.getResourceURL()}/v1/me/invites"
            type: "POST"
            data: user_id: data._id
         , (err, data) => throw(err) if err

      _loadTeams: (done) =>
         fc.ajax
            url: "#{fc.getResourceURL()}/v1/me/teams"
         , (err, profiles) =>
            teams = []
            teams.push p.team_name for p in profiles
            done(null,teams)

      _loadInvites: (done) =>
         fc.ajax 
            url: "#{fc.getResourceURL()}/v1/me/invites"
         , done

      _setInvites: (teams, invites) =>
         if invites.length > 0
            text = []

            for inv in invites
               for t in inv.teams
                  if t in teams
                     text.push "<span>#{t}</span>"
                  else
                     text.push "<span class='diff'>#{t}</span>"

            inv.teams_text = text.join ", "
            @invites.push inv 
         else
            @no_invites(true)

