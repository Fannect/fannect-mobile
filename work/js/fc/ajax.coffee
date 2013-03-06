do ($ = window.jQuery, forge = window.forge, ko = window.ko, fc = window.fannect) ->

   timeoutMessageShowing = false

   fc.ajax = (options, done) ->
      done = done or options.success
      options.cache = options.cache or false
      options.success = (result) ->
         console.log "#{options.url}:", JSON.parse(result) 
         done null, JSON.parse(result) if done
      options.error = (error) ->
         forge.logging.warning "#{options.url} (err) #{JSON.stringify(error)}"
      
         if (error?.status == 401 or error?.statusCode?.toString() == "401")
            if options.second_try
               fc.logger.sendLog("Forced logout (401)")
               fc.auth.logout()
            else
               fc.auth.getNewAccessToken (err, token) ->
                  options.second_try = true
                  
                  # Change access_token in url 
                  if options.url.indexOf("access_token")
                     options.url = options.url.replace(/access_token=.+/, "access_token=#{fc.auth.getAccessToken()}")
                  fc.ajax(options, done)

         else if (error?.status == 0 or error.statusText == "timeout" or error?.type == "UNEXPECTED_FAILURE")
            fc.msg.loading("Request timeout! Retrying...")
            fc.logger.sendError(error)
            setTimeout (() ->
               fc.ajax options, () ->
                  fc.msg.hide()
                  done?.apply(this, arguments)
            ), 1000
         else if options.retry == "forever"
            setTimeout (-> fc.ajax(options, done)), 4000
         else
            try
               fc.logger.sendError(errText = JSON.parse error.responseText)
            catch e
               fc.logger.sendError(error.responseText)
            finally
               done(errText or error) if done

      # Get a new access token if we don't have one and then rerun the requrest
      if not options.no_access_token and not fc.auth.hasAccessToken() and not options.second_try
         return fc.auth.getNewAccessToken (err, token) ->
            options.second_try = true
            if options.url.indexOf("access_token")
               options.url = options.url.replace(/access_token=.+/, "access_token=#{fc.auth.getAccessToken()}")
            fc.ajax(options, done)

      # Append access_token on to querystring
      if not options.no_access_token and options.url.indexOf("access_token") < 0
         if options.url.indexOf("?") > 0
            options.url += "&access_token=#{fc.auth.getAccessToken()}"
         else
            options.url += "?access_token=#{fc.auth.getAccessToken()}"

      console.log "#{options.type or 'GET'}: #{options.url}"
      
      forge.ajax(options)
