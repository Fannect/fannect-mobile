do ($ = jQuery, ko = window.ko, fc = window.fannect) ->

   class fc.viewModels.Connect.Huddle.NewTopic extends fc.viewModels.Base 

      constructor: () ->
         super
         @image = null
         @topic = ko.observable("")
         @message = ko.observable("")
         @image_url = ko.observable("")

      chooseTaggedTeams: () =>
         $.mobile.changePage "connect-huddle-tagTeams.html", transition: "slidedown"

      chooseImage: () =>
         forge.file.getImage null, (file) =>
            forge.file.URL file, (url) =>
               @image = file
               @image_url(url)
            , (err) -> fc.msg.show("Failed to get image!") if err

      rightButtonClick: () =>
         return fc.msg.show("Enter a topic!") if @topic().length == 0
         return fc.msg.show("Enter a message!") if @message().length == 0

         uploaded_image_url = null

         send = () =>
            fc.msg.loading("Creating huddle...")
            fc.team.getActive (err, profile) =>
               fc.ajax 
                  url: "#{fc.getResourceURL()}/v1/teams/#{profile.team_id}/huddles"
                  type: "POST"
                  data: 
                     team_profile_id: profile._id
                     topic: @topic()
                     content: @message()
                     image_url: @image_url()
               , (err, resp) =>
                  fc.msg.hide()
                  if err or resp.status == "error"
                     return fc.msg.show("Couldn't create huddle at this time!")
                  else
                     setTimeout (() => 
                        @image = null 
                        @topic("")
                        @message("")
                        @image_url("")
                     ), 200
                     fc.nav.goBack("flip", { new_huddle: true })

         if @image?
            fc.msg.loading("Uploading image...")
            fc.images.uploadImage @image, (err, data) ->
               fc.msg.hide()
               return fc.msg.show("Unable to upload your image at this time!") if err or data?.url?.length < 1
               uploaded_image_url = data?.url
               send()
         else
            send()