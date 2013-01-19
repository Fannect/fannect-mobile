do ($ = jQuery, ko = window.ko, fc = window.fannect) ->
   fc.viewModels.Games = {}

   class fc.viewModels.Games.AttendanceStreak extends fc.viewModels.Base 
      constructor: () ->
         super
         @checked_in = ko.observable()
         @game_preview = ko.observable()
         @no_game = ko.observable()
         @next_game = ko.observable()
         @stadium = ko.observable
            name: null
            location: null
         @home_team = ko.observable
            name: null
            record: null
         @away_team = ko.observable
            name: null
            record: null

         @center = null
         
         @load()
            
      checkIn: (data) ->
         @checked_in true
         # ajax call

      load: () ->
         fc.ajax 
            url: "#{fc.getResourceURL()}/me/games/attendanceStreak"
            type: "GET"
         , (error, data) =>
            @checked_in data.checked_in
            @no_game data.no_game or true
            @next_game data.next_game
            @stadium data.stadium
            @home_team data.home_team
            @away_team data.away_team
            @game_preview data.game_preview
            @center = new google.maps.LatLng(data.stadium.lat, data.stadium.lng)

            @map = new google.maps.Map $("#games-attendanceStreak-page .map").get(0), 
               zoom: 18
               mapTypeId: google.maps.MapTypeId.SATELLITE
               disableDefaultUI: true
               center: @center
               scrollwheel: false
               panControl: false
               maxZoom: 18
               minZoom: 18
               draggable: false

