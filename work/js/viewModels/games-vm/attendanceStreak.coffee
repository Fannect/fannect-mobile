do ($ = jQuery, ko = window.ko, fc = window.fannect) ->
   fc.viewModels.Games = {}

   class fc.viewModels.Games.AttendanceStreak extends fc.viewModels.Base 
      constructor: () ->
         super
         @checked_in = ko.observable()
         @game_data = new fc.models.GameData()
         @stadium_center = null
         @user_center = null
         @user_pin = null
         @user_distance = ko.observable()
         @in_range = ko.computed () => return @user_distance()? and @user_distance() < .5
         @miles_away = ko.computed () => 
            return Math.round((parseFloat(@user_distance()) - .5) * 100) / 100 + " mi"

         @load()
            
      checkIn: (data) =>
         if @in_range()
            @checked_in true

            fc.team.getActive (err, profile) =>
               fc.ajax
                  url: "#{fc.getResourceURL()}/v1/me/teams/#{profile._id}/games/attendanceStreak"
                  type: "POST"
                  data:
                     lat: @user_center?.lat()
                     lng: @user_center?.lng()
               , (err) ->
                  return fc.msg.show("Something went wrong.. :(") if err
                  fc.showScoringPopup()

      load: () =>
         fc.team.getActive (err, profile) =>
            return fc.msg.show("Unable to load game information!") if err

            fc.ajax 
               url: "#{fc.getResourceURL()}/v1/me/teams/#{profile._id}/games/attendanceStreak"
               type: "GET"
            , (error, data) =>
               return fc.msg.show("Unable to load game information!") if err

               @game_data.set(data)
               @checked_in data.meta?.checked_in
               
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

                  @findUserLocation() unless data.no_game_scheduled
                     
      findUserLocation: () =>
         forge.geolocation.getCurrentPosition
            enableHighAccuracy: true
         , (pos) =>
            @user_center = new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude)

            distance = Math.round google.maps.geometry.spherical.computeDistanceBetween(@user_center, @stadium_center)
            @user_distance(distance / 1609.34)

            if not @user_pin
               @user_pin = new google.maps.Marker(map: @map)

            @user_pin.setPosition @user_center
            setTimeout (() => @findUserLocation()), 2000

         , (err) ->
            fc.msg.show("Unable to get your location... :(")











