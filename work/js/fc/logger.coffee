do ($ = window.jQuery, forge = window.forge, ko = window.ko, fc = window.fannect) ->
   fc.logger =
      setup: () ->
         window.onerror = (m, u, l) ->
            fc.logger.sendError
               message: m
               url: u
               line: l

      sendError: (log) ->
         log.type = "error"
         fc.logger._send(log)  
         
      sendLog: (log) ->
         log.type = "log"
         fc.logger._send(log)  

      _send: (log) ->
         log.page = $.mobile?.activePage?.attr("id")
         forge.ajax
            url: forge.config.modules.parameters.loggly_server
            type: "POST"
            data: log
