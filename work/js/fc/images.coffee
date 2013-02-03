do ($ = window.jQuery, forge = window.forge, ko = window.ko, fc = window.fannect) ->
   showLoading = false
   cachedIsSlow = null

   fc.images =
      getTeamUrl: (url) -> 
         if not url?.length > 0 then return "images/fannect_TeamPlaceholderPic@2x.png"
         if window.devicePixelRatio != 2 
            return fc.images._getUrl(url, 188, 188)
         else
            return url

      getProfileUrl: (url) ->
         if not url?.length > 0 then return "images/fannect_UserPlaceholderPic@2x.png"
         if window.devicePixelRatio != 2 
            return fc.images._getUrl(url, 140, 140)
         else
            return url

      getThumbnailUrl: (url) -> 
         if not url?.length > 0 then return "images/fannect_UserPlaceholderPic@2x.png"
         fc.images._getUrl(url, 43, 43, 90)

      _getUrl: (url, w, h, quality = 100) ->
         return "" if url == "" 
         return url unless url.indexOf("cloudinary") >= 0 
         
         ratio = window.devicePixelRatio or 1
         parsed = url.split("/")
         parsed[parsed.length - 2] = "q_100,w_#{w*ratio},h_#{h*ratio}"

         return parsed.join("/")

     