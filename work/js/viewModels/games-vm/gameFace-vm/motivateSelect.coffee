do ($ = jQuery, ko = window.ko, fc = window.fannect) ->
   
   class fc.viewModels.Games.GameFace.MotivateSelect extends fc.viewModels.Base 
      constructor: () ->
         super 
         @limit = 20
         @skip = 0
         @has_more = true
         @selected_fans = []
         @query = ko.observable("")
         @fans = ko.observableArray()
         @loading_more = ko.observable(false)

         if not forge.is.android()
            @query.subscribe () =>
               if @timeoutId then clearTimeout @timeoutId
               @timeoutId = setTimeout () =>
                  @timeoutId = null
                  @search()
               , 400

      load: () => 
         @query("")
         @search()

      androidSearch: () => @search() if forge.is.android()
      search: () =>
         @skip = 0
         @has_more = true
         @fans.removeAll()
         @loadFans()

      loadFans: () =>
         @loading_more true

         query = @query()
         fc.team.getActive (err, profile) =>
            url = "#{fc.getResourceURL()}/v1/teams/#{profile.team_id}/users?limit=#{@limit}&skip=#{@skip}&friends_of=#{profile._id}&content=gameface"
            if query?.length > 0
               url += "&q=#{escape(query)}"

            fc.ajax 
               url: url
               type: "GET"
            , (err, fans) =>
               return if err or query != @query()
               setTimeout () => 
                  @loading_more false
               , 200

               @has_more = fans.length == @limit
               @skip += @limit
               for fan in fans
                  fan.has_motivator = fan.motivator?
                  fan.selected = ko.observable(@_isSelected(fan._id))
                  @fans.push fan 

      onPageShow: () =>
         super
         $window = $(window).bind "scroll.motivateSelect", () =>
            if not @loading_more() and @has_more and $window.scrollTop() > $(document).height() - $window.height() - 150
               @loading_more true
               @loadFans()

      onPageHide: () => 
         super
         $(window).unbind("scroll.motivateSelect")

      selectUser: (data) => 
         return if data.gameface_on or data.has_motivator

         alreadySelected = data.selected()
         if alreadySelected
            data.selected(false)
            @_removeSelected(data._id)
         else
            data.selected(true)
            @_addSelected(data._id)

      rightButtonClick: () => 
         selected_fans = @selected_fans
         @selected_fans = []
         fc.team.getActive (err, profile) =>
            fc.ajax
               url: "#{fc.getResourceURL()}/v1/me/teams/#{profile._id}/games/gameFace/motivate"
               type: "POST"
               data: 
                  motivatees: selected_fans
            
            fc.nav.goBack("flip")

      _removeSelected: (id) => @selected_fans.splice(@selected_fans.indexOf(id),1)
      _addSelected: (id) => @selected_fans.push(id)
      _isSelected: (id) => @selected_fans.indexOf(id) != -1

      