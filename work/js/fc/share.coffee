do ($ = window.jQuery, forge = window.forge, ko = window.ko, fc = window.fannect) ->
   twitterText = "Think your sports team has the best fans? Download @Fannect to prove it!"
   twitterLink = "http://www.fannect.me"

   fc.share =
      viaTwitter: (done) ->
         forge.flurry.customEvent("Twitter Share", {show: true})
         forge.tabs.openWithOptions
            url: "https://twitter.com/intent/tweet?url=#{escape(twitterLink)}&text=#{escape(twitterText)}"
            pattern: "*://twitter.com/intent/tweet/complete*"
            title: "Share on Twitter"
         , (data) ->
            done(err, data) if done
         , (err) ->
            done(err) if err and done
            
      viaEmail: (done) ->
         forge.flurry.customEvent("Email Share", {show: true})
         fc.msg.loading("Sending email...")
         fc.ajax
            url: "#{fc.getResourceURL()}/v1/share/email"
         , (err, data) ->
            fc.msg.hide()
            if data?.status == "success"
               $.mobile.changePage "share-email.html", transition: "slide"
            else 
               fc.msg.show("Unable to send an email at this time! Please try to share again later!", 2100)

      viaSMS: (done) ->
         forge.flurry.customEvent("SMS Share", {show: true})
         $.mobile.changePage "share-sms.html", transition: "slide"
            