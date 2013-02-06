do ($ = window.jQuery, forge = window.forge, ko = window.ko, fc = window.fannect) ->
   fc.ajax = (options, done) ->
      done = done or options.success
      options.success = (result) ->
         console.log "#{options.url}:", JSON.parse(result) 
         done null, JSON.parse(result) if done
      options.error = (error) ->
         console.error "#{options.url} (err):", error
      
         if (error?.status == 401 or error?.statusCode?.toString() == "401") and not options.second_try
            fc.auth.getNewAccessToken (err, token) ->
               options.second_try = true
               fc.ajax(options, done)
         else if (error?.status == 0 or error.statusText == "timeout")
            fc.msg.loading("Server timeout! Retrying...")
            fc.logger.sendError(error)
            setTimeout (() ->
               fc.ajax(options, done)
            ), 5000
         else
            try
               console.error errText = JSON.parse error.responseText
            finally
               done(errText or error) if done

      # Get a new access token if we don't have one and then rerun the requrest
      if not options.no_access_token and not fc.auth.hasAccessToken() and not options.second_try
         return fc.auth.getNewAccessToken (err, token) ->
            options.second_try = true
            fc.ajax(options, done)

      # Append access_token on to querystring
      if not options.no_access_token and options.url.indexOf("access_token") < 0
         if options.url.indexOf("?") > 0
            options.url += "&access_token=#{fc.auth.getAccessToken()}"
         else
            options.url += "?access_token=#{fc.auth.getAccessToken()}"

      console.log "Requesting: #{options.url}"
      
      forge.ajax(options)