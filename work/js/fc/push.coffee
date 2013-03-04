do ($ = window.jQuery, forge = window.forge, ko = window.ko, fc = window.fannect) ->
   
   is_active = false
   waiting = null

   fc.push =

      setup: () ->
         if forge.is.mobile()
            forge.event.messagePushed.addListener (message) ->
               if message.event == "invite"
                  waiting = () -> 
                     fc.nav.buildHistory("profile", [  
                        new fc.nav.HistoryEntry("profile-invites.html", "slidedown")
                     ], "slidedown")
               else if message.event == "gameface"
                  waiting = () -> 
                     fc.team.setActive(message.profileId) if message.profileId
                     fc.nav.buildHistory("games", [  
                        new fc.nav.HistoryEntry("games-gameFace.html", "slide")
                     ], "slidedown")
                     
               if waiting and is_active
                  forge.launchimage.hide() if forge.is.mobile()
                  waiting()
                  waiting = null

      activate: () -> 
         return false unless forge.is.mobile()
         if not is_active
            is_active = true
            if waiting
               forge.launchimage.hide () ->
                  waiting() 
                  waiting = null
               return true

         return false

