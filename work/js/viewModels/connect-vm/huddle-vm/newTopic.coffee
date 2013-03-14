do ($ = jQuery, ko = window.ko, fc = window.fannect) ->

   class fc.viewModels.Connect.Huddle.NewTopic extends fc.viewModels.Base 

      constructor: () ->
         super
         @image = null
         @topic = ko.observable("")
         @message = ko.observable("")
         @image_url = ko.observable("")
         # @image_url = ko.observable("http://res.cloudinary.com/fannect-dev/image/upload/q_100,w_376,h_376/ihjsx2c4ipyhg06kadrb.jpg")
         @show_remove_image = ko.observable(false)
         @tagged_teams_text = ko.observable("")
         @tagged = null

      load: () =>
         if @params?.tagged
            @tagged = {}
            @tagged.include_teams = (t for t in @params.tagged.include_teams)
            @tagged.include_conference = @params.tagged.include_conference
            @tagged.include_league = @params.tagged.include_league

         if @tagged?.include_teams? or @tagged?.include_conference or @tagged?.include_league
            names = []
            names.push(@tagged.include_league) if @tagged.include_league
            names.push(@tagged.include_conference) if @tagged.include_conference
            names.push(t.full_name) for t in @tagged.include_teams if @tagged.include_teams
            if names.length > 0 then @tagged_teams_text("+ #{names.join(', ')}")
            else @tagged_teams_text("")

      chooseTaggedTeams: () =>
         $.mobile.changePage "connect-huddle-tagTeams.html", { transition: "none", params: tagged: @tagged }

      chooseImage: () =>
         forge.file.getImage null, (file) =>
            forge.file.URL file, (url) =>
               @image = file
               @image_url(url)
            , (err) -> fc.msg.show("Failed to get image!") if err

      removeImage: () => 
         @image = null
         @image_url("")
      showRemoveImage: () => @show_remove_image(not @show_remove_image())

      rightButtonClick: () =>
         return fc.msg.show("Enter a topic!") if @topic().length == 0
         return fc.msg.show("Enter a message!") if @message().length == 0

         uploaded_image_url = null

         send = () =>
            fc.msg.loading("Creating huddle...")
            fc.team.getActive (err, profile) =>

               if @tagged?.include_teams
                  include_teams = (t._id for t in @tagged.include_teams)

               include_league = if @tagged?.include_league then true else false
               include_conference = if @tagged?.include_conference then true else false

               fc.ajax 
                  url: "#{fc.getResourceURL()}/v1/teams/#{profile.team_id}/huddles"
                  type: "POST"
                  data: 
                     team_profile_id: profile._id
                     topic: @topic()
                     content: @message()
                     image_url: uploaded_image_url
                     include_teams: include_teams
                     include_league: include_league
                     include_conference: include_conference
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
            uploaded_image_url = @image_url()
            send()