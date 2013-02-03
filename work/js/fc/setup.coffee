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
               fc.msg.loading("Connection lost. Attempting to reconnect...")
            else  
               fc.msg.hide()

         forge.event.connectionStateChange.addListener(handleConnectionChange, handleConnectionChange)
