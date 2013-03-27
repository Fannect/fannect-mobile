do ($ = window.jQuery, forge = window.forge, ko = window.ko, fc = window.fannect) ->
   twitterText = "Just got the @Fannect sports app. Go download it and add me to your [insert team here] roster!"
   twitterLink = "http://www.fannect.me"

   fc.share =
      viaTwitter: (done) ->
         fc.team.getActive (err, profile) ->
            text = twitterText.replace("[insert team here]", profile.team_name) 

            forge.flurry.customEvent("Twitter Share", {show: true})
            forge.tabs.openWithOptions
               url: "https://twitter.com/intent/tweet?url=#{escape(twitterLink)}&text=#{escape(text)}"
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
         forge.sms.send
            body: "Download the Fannect app and add me to your roster! http://get.fannect.me"
            to: []
         , () -> 
            done() if done
         , (err) -> 
            done(err) if done
