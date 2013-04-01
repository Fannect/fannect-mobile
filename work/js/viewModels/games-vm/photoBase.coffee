do ($ = jQuery, ko = window.ko, fc = window.fannect) ->

   class fc.viewModels.Games.PhotoBase extends fc.viewModels.Base 
      constructor: () ->
         super
         @picture = null
         @picture_url = ko.observable("")
         @has_picture = ko.computed () => return @picture_url()?.length > 0
         @caption = ko.observable("")
         @show_popup = ko.observable(false)
         @game_type = null
      
      load: () =>

      submit: () =>
         throw new Error("game_type must be set") unless @game_type
         return unless @has_picture()

         fc.logger.flurry("Play #{@game_type}")
         
         image_url = @picture_url
         fc.msg.loading("Uploading picture...")

         send = () =>
            fc.team.getActive (err, profile) =>
               return fc.msg.show("Failed to upload image!") if err
               fc.ajax 
                  url: "#{fc.getResourceURL()}/v1/me/teams/#{profile._id}/games/#{@game_type}"
                  type: "POST"
                  data: 
                     image_url: image_url
                     caption: @caption()
                     game_type: @game_type
               , (err, resp) =>
                  forge.logging.critical("RESPONSE: #{JSON.stringify(resp)} -----------------------------")
                  # $.mobile.changePage.
                  fc.msg.hide()

         if @picture
            fc.images.uploadImage @picture, (err, data) =>
               return fc.msg.show("Failed to upload image!") if err or not data?.url?
               image_url = data.url
               send()
         else
            send()
            
      showPopup: () => @show_popup(true)
      hidePopup: () => @show_popup(false)

      takePicture: () =>
         forge.file.getImage {source: "camera"}, (file) =>
            @hidePopup()
            forge.file.URL file, (url) =>
               @picture = file
               @picture_url(url)
            , (err) -> fc.msg.show("Failed to get picture!") if err

      choosePicture: () =>
         forge.file.getImage {source: "gallery"}, (file) =>
            @hidePopup()
            forge.file.URL file, (url) =>
               @picture = file
               @picture_url(url)
            , (err) -> fc.msg.show("Failed to get picture!") if err

      chooseInstagram: () =>

