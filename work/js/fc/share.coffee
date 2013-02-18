do ($ = window.jQuery, forge = window.forge, ko = window.ko, fc = window.fannect) ->
   twitterText = ""
   twitterLink = "http://www.fannect.me"

   fc.share =
      viaTwitter: (done) ->
         forge.tabs.openWithOptions
            url: "https://twitter.com/intent/tweet?url=#{escape(twitterLink)}&text=#{escape(twitterText)}"
            pattern: "*://twitter.com/intent/tweet/complete*"
            title: "Share on Twitter"
         , (data) ->
            done(err, data) if done
         , (err) ->
            done(err) if err and done
            
      viaEmail: (done) ->
         fc.ajax
            url: "#{fc.getResourceURL()}/v1/share/email"
         , (err, data) ->
            console.log "SHARED VIA EMAIL"

      viaSMS: (done) ->
         forge.contact.selectAll (contact) ->
            console.log "CONTACT #{JSON.stringify(contact)}"
         , (err) ->
            console.log "CONTACT ERR: #{JSON.stringify(err)}"