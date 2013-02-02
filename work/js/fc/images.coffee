do ($ = window.jQuery, forge = window.forge, ko = window.ko, fc = window.fannect) ->
   showLoading = false
   cachedIsSlow = null

   fc.images =
      getTeamUrl: (url) -> 
         return url if url == "images/fannect_TeamPlaceholderPic@2x.png"
         if window.devicePixelRatio != 2 
            return fc.images._getUrl(url, 188, 188)
         else
            return url

      getProfileUrl: (url) ->
         return url if url == "images/fannect_UserPlaceholderPic@2x.png"
         if window.devicePixelRatio != 2 
            return fc.images._getUrl(url, 140, 140)
         else
            return url

      getThumbnailUrl: (url) -> 
         return url if url == "images/fannect_UserPlaceholderPic@2x.png"
         fc.images._getUrl(url, 43, 43, 90)

      _getUrl: (url, w, h, quality = 100) ->
         if url == "" 
            return ""
         
         ratio = window.devicePixelRatio or 1
         parsed = url.split("/")
         parsed[parsed.length - 2] = "q_100,w_#{w*ratio},h_#{h*ratio}"

         return parsed.join("/")

     