do ($ = jQuery, ko = window.ko, fc = window.fannect) ->

   compareEvents = (a, b) ->
      if a.date < b.date 
         return -1
      else if a.date > b.date
         return 1
      else
         return 0

   eventSummary =
      attendance_streak: (e, name) ->
         e.summary = "#{name} scored <b>#{e.points} Points</b> by checking in to 
            #{e.meta.stadium_name} for #{e.meta.team_name} vs #{e.meta.opponent}!"

      guess_the_score: (e, name) ->
         my_score = if e.meta.is_home then e.meta.home_score else e.meta.away_score
         opponent_score = if e.meta.is_home then e.meta.away_score else e.meta.home_score
         my_actual_score = if e.meta.is_home then e.meta.actual_home_score else e.meta.actual_away_score
         opponent_actual_score = if e.meta.is_home then e.meta.actual_away_score else e.meta.actual_home_score

         e.summary = "#{name} scored <b>#{e.points} Points</b> by guessing a score of 
            #{my_score}-#{opponent_score} for #{e.meta.team_name} vs #{e.meta.opponent}! 
            (#{my_actual_score}-#{opponent_actual_score})"

      game_face: (e, name) ->
         if e.meta.motivated_count > 0
            e.summary = "#{name} scored <b>#{e.points} Points</b> by turning on 
               GameFace and motivating #{e.meta.motivated_count} others 
               for #{e.meta.team_name} vs #{e.meta.opponent}!"
         else
            e.summary = "#{name} scored <b>#{e.points} Points</b> by turning on 
               GameFace for #{e.meta.team_name} vs #{e.meta.opponent}!"

      spirit_wear: (e, name) ->
         e.summary = "#{name} scored <b>#{e.points} Points</b> by submitting a
            Spirit Wear photo." 

      gameday_pics: (e, name) ->
         e.summary = "#{name} scored <b>#{e.points} Points</b> by submitting a
            Gameday Pics photo." 

      photo_challenge: (e, name) ->
         e.summary = "#{name} scored <b>#{e.points} Points</b> by submitting a
            Photo Challenge photo." 

      picture_with_player: (e, name) ->
         e.summary = "#{name} scored <b>#{e.points} Points</b> by submitting a
            Picture with a Player photo." 

   eventPointsEarned = (e) ->
      for cat, points of e.points_earned
         e.points = points
         e.points_text = "<span class='plus'>+</span>#{points} #{cat}"
         e.points_category = cat
         break

   eventDateText = (e) ->
      e.date_text = dateFormat(e.date, " mm/dd/yyyy h:MM TT")

   class fc.models.Events

      constructor: (profile_id, name, load_now) ->
         @profile_id = profile_id
         @name = name
         @events = ko.observableArray()
         @is_loading = ko.observable(true)
         @limit = 10
         @skip = 0
         @has_more = ko.observable(true)
         @_load_waiting = false
         @_has_loaded = false
         @load() if load_now

      setup: (profile_id, name) =>
         if @profile_id != profile_id
            @profile_id = profile_id
            @name = name or "You"
            @empty()
            @load() if @_load_waiting or @_has_loaded
            @_load_waiting = false

      reset: () =>
         @profile_id = null
         @name = null
         @empty()

      empty: () =>
         @events.removeAll()
         @_has_loaded = false
         @skip = 0
         @has_more(true)
         @is_loading(true)

      load: () =>
         return unless @has_more()
         return @_load_waiting = true unless @profile_id 

         @is_loading(true)
         fc.ajax
            url: "#{fc.getResourceURL()}/v1/teamprofiles/#{@profile_id}/events?skip=#{@skip}&limit=#{@limit}"
         , (err, events) =>
            @is_loading(false)
            return @has_more(false) if not events?.length > 0 

            @skip += @limit
            
            has_results = false

            for event in events
               # continue if there is not enough information to display event
               continue if (not event.meta.team_name? and not event.meta?.highlight_id?)

               for e in @events()
                  dupl = false
                  if e._id == event._id
                     dupl = true
                     break
               continue if dupl
               has_results = true

               event.date = fc.parseId(event._id)
               eventPointsEarned(event)
               eventSummary[event.type](event, @name)
               eventDateText(event)
               @events.push(event)

            @has_more(has_results and events.length == @limit)
            @events().sort(compareEvents) if has_results
            @_has_loaded = true
