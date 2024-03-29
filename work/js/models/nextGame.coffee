do ($ = jQuery, ko = window.ko, fc = window.fannect) ->

   class fc.models.NextGame

      constructor: (data) ->
         @set(data)   

      set: (data = {}) =>
         @game_date = if data.game_time then dateFormat(data.game_time, "dddd, mmmm d, yyyy") else "TBD"
         @stadium_name = data.stadium_name
         @stadium_location = data.stadium_location

         if @game_date == "TBD"
            @home_team = "Unknown"
            @away_team = "Unknown"
         else
            @home_team = data.home_team or "Unknown"
            @away_team = data.away_team or "Unknown"

         if data.game_time 
            @time_and_coverage = dateFormat(data.game_time, "h:MM TT")
            @time_and_coverage += " - #{data.coverage}" if data.coverage
         else  
            @time_and_coverage = ""