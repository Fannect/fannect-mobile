do ($ = window.jQuery, forge = window.forge, ko = window.ko, fc = window.fannect) ->
   showLoading = false
   cachedIsSlow = null

   fc.images =
      getTeamUrl: (url) -> 
         if not url?.length > 0 then return "images/fannect_TeamPlaceholderPic@2x.png"
         return getUrl(url, 188, 188)
      
      getProfileUrl: (url) ->
         if not url?.length > 0 then return "images/fannect_UserPlaceholderPic@2x.png"
         return getUrl(url, 140, 140)
         
      getThumbnailUrl: (url) -> 
         if not url?.length > 0 then return "images/fannect_UserPlaceholderPic@2x.png"
         getUrl(url, 43, 43, 90)

      uploadProfile: (file, done) ->
         transform = [
            {
               width: 272 
               height: 272
               crop: "fill"
               gravity: "faces"
               quality: 100 
            }
         ]
         fc.images.uploadImage(file, transform, done)

      uploadTeam: (file, done) ->
         transform = [
            {
               width: 376 
               height: 376
               crop: "fill"
               gravity: "faces"
               quality: 100 
            }
         ]
         fc.images.uploadImage(file, transform, done)

      uploadImage: (file, transforms, done) ->
         # shift parameters
         if arguments.length < 3
            done = transforms
            transforms = null


         ajax = 
            url: "#{fc.getResourceURL()}/v1/images/signature"
            type: "POST"
            data: {}

         ajax.data = { transformation: transforms } if transforms
         
         fc.ajax ajax, (err, data) =>
            return done(err) if err
            return done(data) if data?.status == "error"
            
            # use the information for the server to send image
            file.name = "file"
            fc.ajax
               url: "http://api.cloudinary.com/v1_1/#{data.cloud_name}/image/upload"
               type: "POST"
               files: [file]
               data: data.params
               timeout: 120000
               no_access_token: true
            , (err, data) ->
               return done(err) if err
               return done(data) if data?.error
               done(null, data)

      getWidestUrl: (url) ->
         return "" if url == "" 
         return url unless url.indexOf("cloudinary") >= 0 
         
         ratio = window.devicePixelRatio or 1
         parsed = url.split("/")
         parsed[parsed.length - 2] = "q_100,w_#{Math.ceil($(window).width()*ratio)}"
         return parsed.join("/")

   getUrl = (url, w, h, quality = 100) ->
      return "" if url == "" 
      return url unless url.indexOf("cloudinary") >= 0 
      
      ratio = window.devicePixelRatio or 1
      parsed = url.split("/")
      parsed[parsed.length - 2] = "q_100,w_#{Math.ceil(w*ratio)},h_#{Math.ceil(h*ratio)}"
      return parsed.join("/")


     