do ($ = jQuery, ko = window.ko, fc = window.fannect) ->
   fc.viewModels.Games = {}

   class fc.viewModels.Games.AttendanceStreak extends fc.viewModels.Base 
      constructor: () ->
         super
         @checked_in = ko.observable()
         @no_game = null
         @next_game = null
         @stadium_name = null
         @stadium_location = null
         @home_team = null
         @home_record = null
         @away_team = null
         @away_record = null
         @game_preview = null
            
      checkIn: (data) ->
         @checked_in true
         # ajax call

      load: (done) ->
         fc.ajax 
            url: "#{fc.getResourceURL()}/me/games/attendanceStreak"
            type: "GET"
         , (error, data) =>
            @checked_in = ko.observable data.checked_in
            @no_game = data.no_game or true
            @next_game = data.next_game
            @stadium_name = data.stadium.name
            @stadium_location = data.stadium.location
            @home_team = data.home.name
            @home_record = data.home.record
            @away_team = data.away.name
            @away_record = data.away.record
            @game_preview = data.game_preview
            done null, data