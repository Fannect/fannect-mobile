do ($ = jQuery, ko = window.ko, fc = window.fannect) ->

   class fc.viewModels.Games.ChooseInstagram extends fc.viewModels.Base 
      constructor: () ->
         super
         @limit = 20
         @max_id = null
         @selected = false
         @has_more = ko.observable(true)
         
         @loading_more = ko.observable false
         @images = ko.observableArray []
         
      load: () =>
         @has_more(true)
         @selected = false
         @max_id = null
         @images.removeAll()

         fc.user.get (err, user) =>
            if user.instagram
               @loadImages()
            else
               fc.user.linkInstagram (err, success) =>
                  if success then @loadImages()
                  else fc.nav.goBack()

      onPageShow: () =>
         $window = $(window).bind "scroll.chooseInstagram", () =>
            if not @loading_more() and @has_more() and $window.scrollTop() > $(document).height() - $window.height() - 150
               @loadImages()

      onPageHide: () =>
         $(window).unbind("scroll.chooseInstagram")

      loadImages: () ->
         @loading_more true
         url = "#{fc.getResourceURL()}/v1/images/instagram?limit=#{@limit}"
         url += "&max_id=#{@max_id}" if @max_id
         fc.ajax 
            url: url
            type: "GET"
         , (err, data) =>
            if err or data?.status == "fail"
               fc.user.update({ instagram: false })
               return fc.msg.show("Failed to load Instagram images!") 
            
            @loading_more(false)
            @has_more(data.images.length == @limit and data?.meta?.next_max_id)
            @max_id = data.meta?.next_max_id
            for image in data.images
               image.selected = ko.observable(false)
               @images.push image 

      select: (data) =>
         if not @selected
            @selected = true
            @images()[@images.indexOf(data)].selected(true)
            fc.nav.goBack("flip", picture_url: data.url)
