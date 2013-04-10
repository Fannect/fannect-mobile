do ($ = jQuery, ko = window.ko, fc = window.fannect) ->

   compareEvents = (a, b) ->
      if a.date > b.date 
         return -1
      else if a.date < b.date
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

      spirit_wear: (e, name) -> eventSummary.photo_game(e, name, "Spirit Wear")
      gameday_pics: (e, name) -> eventSummary.photo_game(e, name, "Gameday Pics")
      photo_challenge: (e, name) -> eventSummary.photo_game(e, name, "Photo Challenge")
      picture_with_player: (e, name) -> eventSummary.photo_game(e, name, "Picture with a Player")
      
      photo_game: (e, name, game) ->
         switch e.meta.rank
            when 1 then sup = "<sup>st</sup>"
            when 2 then sup = "<sup>nd</sup>"
            when 3 then sup = "<sup>rd</sup>"
            else sup = "<sup>th</sup>"

         if 0 < e.meta.rank < 10
            e.summary = "#{name} scored <b>#{e.points} Points</b> for #{e.meta.rank}#{sup} 
               place in the #{game} competition."
         else
            e.summary = "#{name} scored <b>#{e.points} Point</b> for participating 
               in the #{game} competition."

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
               # continue if unknown game type
               continue unless eventSummary[event.type]

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
            @events.valueHasMutated()
            @_has_loaded = true
