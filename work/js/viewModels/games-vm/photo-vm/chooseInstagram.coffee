do ($ = jQuery, ko = window.ko, fc = window.fannect) ->

   class fc.viewModels.Games.ChooseInstagram extends fc.viewModels.Base 
      constructor: () ->
         super
         @limit = 20
         @skip = 0
         @selected = false
         @has_more = ko.observable(true)
         
         @loading_more = ko.observable false
         @images = ko.observableArray []
         
      load: () =>
         @selected = false
         @has_more(true)
         @skip = 0
         @images.removeAll()

      onPageShow: () =>
         $window = $(window).bind "scroll.chooseWebImage", () =>
            if @has_searched and not @loading_more() and $window.scrollTop() > $(document).height() - $window.height() - 150
               @loadImages @query()

      onPageHide: () =>
         $(window).unbind("scroll.chooseWebImage")

      loadImages: () ->
         @loading_more true

         fc.ajax 
            url: "#{fc.getResourceURL()}/v1/images/instagram?limit=#{@limit}&skip=#{@skip}"
            type: "GET"
         , (err, images) =>
            return fc.msg.show("Failed to load Instagram images!") if err or images?.status == "fail"
            @has_more(images.length == @limit)
            @skip += @limit
            for image in data
               image.selected = ko.observable(false)
               @images.push image 

      select: (data, event) =>
         if not @selected
            @selected = true
            @images()[@images.indexOf(data)].selected(true)
            
            fc.nav.goBack(null, instagram_url: @image)

            fc.team.getActive (err, profile) =>
               fc.ajax 
                  url: "#{fc.getResourceURL()}/v1/images/me/#{profile._id}"
                  type: "POST"
                  data: image_url: data.url
               , (err, data) =>
                  fc.msg.hide()

                  if err
                     fc.msg.show("Unable to upload image due to copyright.")
                     @selected = false
                     @images()[@images.indexOf(data)].selected(false)
                  else
                     fc.team.updateActive(data)
                     fc.nav.goBack()
