do ($ = window.jQuery, forge = window.forge, ko = window.ko, fc = window.fannect) ->
   
   is_active = false
   waiting = null

   fc.push =

      setup: () ->
         if forge.is.mobile()
            forge.event.messagePushed.addListener (message) ->
               if message.event == "invite"
                  waiting = () -> $.mobile.changePage "profile-invites.html", transition: "slidedown"
         
               waiting() if waiting and is_active

      activate: () -> 
         if not is_active
            is_active = true
            waiting() if waiting

