do ($ = window.jQuery, forge = window.forge, ko = window.ko, fc = window.fannect) ->

   history = []
   shouldReset = false

   fc.logger =
      setup: () ->
         window.onerror = (m, u, l) ->
            forge.logging.critical "HIT ERROR:\n message: #{m},\n url: #{u},\n line: #{l}"
            fc.logger.sendError
               message: m
               url: u
               line: l

      shouldReset: (value) ->
         shouldReset = value

      log: (value) ->
         history.push(value)
         history.shift() if history.length > 50

      flurry: (key, params) ->
         params = params or { show: true }
         fc.logger.log(key)
         forge.flurry.customEvent(key, params)

      sendError: (log = {}) ->
         log.type = "error"
         fc.logger._send(log)  

         if shouldReset
            fc.mobile.clearBottomButtons()
            forge.topbar.removeButtons()
            window.location = "profile.html?reset=true" 
         
      sendLog: (log = {}) ->
         if typeof log == "string"
            log = { message: log }
         log.type = "log"
         fc.logger._send(log)  

      _send: (log = {}) ->
         log.page = $.mobile?.activePage?.attr("id")
         log.history = JSON.stringify(history)
         forge.ajax
            url: forge.config.modules.parameters.loggly_server
            type: "POST"
            data: log
