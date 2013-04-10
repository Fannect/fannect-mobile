do ($ = window.jQuery, forge = window.forge, ko = window.ko, fc = window.fannect) ->
   
   isActive = false
   waiting = null
   hasSetup = false

   fc.push =

      setup: () ->
         if forge.is.mobile() and not hasSetup
            hasSetup = true
            forge.event.messagePushed.addListener (message) ->
               return unless message
               if message.event == "invite"
                  waiting = () -> 
                     fc.nav.buildHistory("profile", [  
                        new fc.nav.HistoryEntry("profile-invites.html", "slidedown")
                     ], { transition: "slidedown" })
               else if message.event == "gameface"
                  waiting = () -> 
                     fc.team.setActive(message.profileId) if message.profileId
                     fc.nav.buildHistory("games", [  
                        new fc.nav.HistoryEntry("games-gameFace.html", "slide")
                     ], { transition: "slidedown" })
               # else if message.event == "gameday"
                     
               if waiting and isActive
                  forge.launchimage.hide() if forge.is.mobile()
                  waiting()
                  waiting = null

      activate: () -> 
         return false unless forge.is.mobile()
         if not isActive
            isActive = true
            if waiting
               forge.launchimage.hide () ->
                  waiting() 
                  waiting = null
               return true

         return false

