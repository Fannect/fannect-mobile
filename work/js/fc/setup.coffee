do ($ = window.jQuery, forge = window.forge, ko = window.ko, fc = window.fannect) ->
   
   fc.setup = () ->
      $.mobile.allowCrossDomainPages = true
      $.mobile.loader.prototype.options.text = "Loading";
      $.mobile.loader.prototype.options.textVisible = true
      $.mobile.loader.prototype.options.theme = "b"
      $.mobile.loader.prototype.options.html = ""

      # Handle connect state changes
      if forge.is.mobile()
         handleConnectionChange = () ->
            if not forge.is.connection.connected()
               $.mobile.loading "show",
                  text: "Connection lost. Attempting to reconnect..."
                  textVisible: true
                  theme: "a"
            else  
               $.mobile.loading "hide"

         forge.event.connectionStateChange.addListener(handleConnectionChange, handleConnectionChange)
