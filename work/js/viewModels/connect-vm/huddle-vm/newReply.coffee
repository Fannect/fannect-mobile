do ($ = jQuery, ko = window.ko, fc = window.fannect) ->

   class fc.viewModels.Connect.Huddle.NewReply extends fc.viewModels.Base 

      constructor: () ->
         super
         @huddle_id = null
         @image = null
         @message = ko.observable()
         @topic = ko.observable()
         @image_url = ko.observable("")
         @owner = ko.observable()
         @show_remove_image = ko.observable(false)
         
      load: () =>
         return fc.nav.backToRoot("connect") unless @params?.huddle_id

         if @huddle_id != @params.huddle_id
            @huddle_id = @params.huddle_id
            @image = null

            @image_url("")
            @message("")

            if @params.topic?.length > 0 and @params.owner?.length > 1
               @topic(@params.topic)
               @owner(@params.owner)
            else
               @topic("")
               @owner("")
               # @image_url("http://res.cloudinary.com/fannect-dev/image/upload/q_100,w_376,h_376/ihjsx2c4ipyhg06kadrb.jpg")
               fc.team.getActive (err, profile) =>
                  fc.ajax
                     url: "#{fc.getResourceURL()}/v1/huddles/#{@params.huddle_id}"
                     type: "GET"
                  , (err, huddle) =>
                     return fc.msg.show("Unable to load huddle information") if err or huddle?.status == "fail"
                     return unless huddle_id == @huddle_id
                     @topic(huddle.topic)
                     @owner(huddle.owner_name)

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
         return fc.msg.show("Enter a message!") if @message().length == 0

         uploaded_image_url = null

         send = () =>
            fc.team.getActive (err, profile) =>
               fc.msg.loading("Replying...")
               fc.ajax 
                  url: "#{fc.getResourceURL()}/v1/huddles/#{@params.huddle_id}/replies"
                  type: "POST"
                  data: 
                     team_profile_id: profile._id
                     content: @message()
                     image_url: uploaded_image_url
               , (err, resp) =>
                  fc.msg.hide()
                  if err or resp.status == "error"
                     return fc.msg.show("Couldn't reply at this time!")
                  else
                     setTimeout (() =>  
                        @image = null 
                        @message("")
                        @image_url("")
                     ), 200
                     fc.nav.goBack("flip", { new_reply: resp.reply })

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
            