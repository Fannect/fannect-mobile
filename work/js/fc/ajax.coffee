do ($ = window.jQuery, forge = window.forge, ko = window.ko, fc = window.fannect) ->
   fc.ajax = (options, done) ->
      done = done or options.success
      console.log "Requesting: #{options.url}"
      options.success = (result) ->
         console.log "#{options.url}:", JSON.parse(result) 
         # fc.loading "hide" unless options.hide_loading
         done null, JSON.parse(result)
      options.error = (error) ->
         console.error "#{options.url} (err):", error
         # fc.loading "hide" unless options.hide_loading

         if error?.status == 401 and not options.second_try
            fc.auth.getNewAccessToken (err, token) ->
               options.second_try = true
               fc.ajax(options, done)
         else
            console.error JSON.parse error.responseText
            throw error
            done error

      # Get a new access token if we don't have one and then rerun the requrest
      if not fc.auth.hasAccessToken()
         return fc.auth.getNewAccessToken (err, token) ->
            options.second_try = true
            fc.ajax(options, done)

      # Append access_token on to querystring
      if options.url.indexOf("?") > 0
         options.url += "&access_token=#{fc.auth.getAccessToken()}"
      else
         options.url += "?access_token=#{fc.auth.getAccessToken()}"

      # fc.loading "show" unless options.hide_loading
      forge.ajax(options)