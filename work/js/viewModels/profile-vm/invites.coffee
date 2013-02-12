do ($ = jQuery, ko = window.ko, fc = window.fannect) ->

   class fc.viewModels.Profile.Invites extends fc.viewModels.Base 
      constructor: () ->
         super
         @invites = ko.observableArray()
         @no_invites = ko.observable(false)
         @invites.subscribe () => fc.user.updateInvites(@invites())
         @is_loading = ko.observable(true)
         @load()

      load: () =>
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
         @no_invites(@invites().length == 0)

         fc.ajax
            url: "#{fc.getResourceURL()}/v1/me/invites/delete"
            type: "POST"
            data: user_id: data._id
         , (err) => throw(err) if err

      acceptInvite: (data) =>
         @invites.remove(data)
         forge.flurry.customEvent("Accept Invite")
         fc.ajax
            url: "#{fc.getResourceURL()}/v1/me/invites"
            type: "POST"
            data: user_id: data._id
         , (err, data) => throw(err) if err

      _loadTeams: (done) =>
         fc.ajax
            url: "#{fc.getResourceURL()}/v1/me/teams"
            retry: "forever"
         , (err, profiles) =>
            teams = []
            teams.push p.team_name for p in profiles
            done(null,teams)

      _loadInvites: (done) =>
         @is_loading(true)
         fc.ajax 
            url: "#{fc.getResourceURL()}/v1/me/invites"
            retry: "forever"
         , (err, users) =>
            @is_loading(false)
            for user in users
               user.profile_image_url = "images/fannect_UserPlaceholderPic@2x.png" unless user.profile_image_url?.length > 2
            done(err, users)

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

      rightButtonClick: () => @_loadInvites()

