do ($ = jQuery, ko = window.ko, fc = window.fannect) ->

   class fc.viewModels.Connect.Huddle.NewTopic extends fc.viewModels.Base 

      constructor: () ->
         super
         @image = null
         @topic = ko.observable("")
         @message = ko.observable("")
         @image_url = ko.observable("")
         # @image_url = ko.observable("http://res.cloudinary.com/fannect-dev/image/upload/q_100,w_376,h_376/ihjsx2c4ipyhg06kadrb.jpg")
         @tagged = null

      load: () =>
         if @params?.tagged
            @tagged = {}
            @tagged.include_teams = (t for t in @params.tagged.include_teams)
            @tagged.include_conference = @params.tagged.include_conference
            @tagged.include_league = @params.tagged.include_league

      chooseTaggedTeams: () =>
         $.mobile.changePage "connect-huddle-tagTeams.html", { transition: "slidedown", params: tagged: @tagged }

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

               if @tagged?.include_teams
                  include_teams = (t._id for t in @tagged.include_teams)

               fc.ajax 
                  url: "#{fc.getResourceURL()}/v1/teams/#{profile.team_id}/huddles"
                  type: "POST"
                  data: 
                     team_profile_id: profile._id
                     topic: @topic()
                     content: @message()
                     image_url: @image_url()
                     include_teams: include_teams
                     include_league: @tagged?.include_league
                     include_conference: @tagged?.include_conference
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
                        @tagged = null
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