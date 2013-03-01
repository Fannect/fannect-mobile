do ($ = window.jQuery, forge = window.forge, ko = window.ko, fc = window.fannect) ->
   
   fc.verified = (type) ->
      return "" unless type
      if type.indexOf("player") != -1
         return "Player"
      else if type.indexOf("coach") != -1
         return "Coach"
      else if type.indexOf("authority") != -1
         return "Authority"
      else if type == "fannect_squad"
         return "Fannect Squad"
      return ""
