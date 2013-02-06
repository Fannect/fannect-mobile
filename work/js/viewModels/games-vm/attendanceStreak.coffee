do ($ = jQuery, ko = window.ko, fc = window.fannect) ->
   fc.viewModels.Games = {}

   class fc.viewModels.Games.AttendanceStreak extends fc.viewModels.Base 
      constructor: () ->
         super
         @checked_in = ko.observable()
         @game_preview = ko.observable()
         @available = ko.observable()
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
         @stadium_center = null
         @user_center = null
         @user_pin = null
         @user_distance = ko.observable()
         @in_range = ko.computed () => false#return @user_distance()? and @user_distance() < 5280
         @miles_away = ko.computed () => 
            return @user_distance()
            # if @user_distance >= 1000


         @load()
            
      checkIn: (data) =>
         @checked_in true
         # ajax call

      load: () =>
         fc.team.getActive (err, profile) =>
            return fc.msg.show("Unable to load game information!") if err

            fc.ajax 
               url: "#{fc.getResourceURL()}/v1/me/teams/#{profile._id}/games/attendanceStreak/mock2"
               type: "GET"
            , (error, data) =>
               return fc.msg.show("Unable to load game information!") if err

               @available data.available
               @checked_in data.meta?.checked_in
               @game_preview data.preview
               @next_game if data.game_time then dateFormat(new Date(data.game_time), "ddd, mmmm dS, h:MM TT") else "TBD"

               away = { name: "Unknown", record: "" } 
               home = { name: "Unknown", record: "" } 
               stadium = { name: "Unknown", location: "Unknown" } 
               
               $.extend home, data.home_team
               $.extend away, data.away_team
               $.extend stadium, data.stadium
               
               @home_team home
               @away_team away
               @stadium stadium

               if data.stadium?.lat and data.stadium?.lng 
                  @stadium_center = new google.maps.LatLng(data.stadium.lat, data.stadium.lng)

                  @map = new google.maps.Map $("#games-attendanceStreak-page .map").get(0), 
                     zoom: 17
                     mapTypeId: google.maps.MapTypeId.SATELLITE
                     disableDefaultUI: true
                     disableDoubleClickZoom: true
                     center: @stadium_center
                     scrollwheel: false
                     panControl: false
                     maxZoom: 17
                     minZoom: 17
                     draggable: false

                  @findUserLocation() if @available()
                     
      findUserLocation: () =>
         forge.geolocation.getCurrentPosition
            enableHighAccuracy: true
         , (pos) =>
            @user_center = new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude)

            distance = Math.round google.maps.geometry.spherical.computeDistanceBetween(@user_center, @stadium_center)
            @user_distance(Math.round(distance * 3.28084))

            console.log @user_distance()

            if not @user_pin
               @user_pin = new google.maps.Marker(map: @map)

            @user_pin.setPosition @user_center
            setTimeout (() => @findUserLocation()), 2000

         , (err) ->
            fc.msg.show("Unable to get your location... :(")











