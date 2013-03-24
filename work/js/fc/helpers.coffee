do ($ = window.jQuery, forge = window.forge, ko = window.ko) ->
   showLoading = false
   cachedIsSlow = null

   fc = window.fannect = 
      viewModels: {}

   fc.getResourceURL = () ->
      "http://api.fannect.me"
      # "https://fannect-api-dev.herokuapp.com"
      # return "http://192.168.2.11:2100"
      # return "http://192.168.0.24:2100"
      # return if forge.is.web() then "http://localhost:2100" else "http://api.fannect.me"

   fc.getLoginURL = () ->
      "https://fannect-login.herokuapp.com"
      # "https://fannect-login-dev.herokuapp.com"
      # return "http://192.168.2.11:2200"
      # return "http://192.168.0.24:2200"
      # return if forge.is.web() then "http://localhost:2200" else "https://fannect-login.herokuapp.com"

   fc.getMenuRoot = (page) -> return $(".header h1", page)?.first()?.attr("data-menu-root")
   fc.getHeaderText = (page) -> return $(".header h1", page).text()

   fc.isSlow = () ->
      unless cachedIsSlow?
         result = new UAParser().getResult()
         cachedIsSlow = result.os.name == "Android" and parseFloat(result.os.version) < 3.0

      return cachedIsSlow

   fc.transition = (transition) ->
      if fc.isSlow() or not transition then { transition: "none" } else  { transition: transition }

   fc.loading = (status) ->
      showLoading = status == "show"
      if showLoading
         $.mobile.loading "show",
            text: "Loading"
            textVisible: true
            theme: "b"
            html: ""
      else
         $.mobile.loading "hide"

   $(document).on "pageshow", ".ui-page", () -> if showLoading then fc.loading "show"

   fc.parseId = (_id) ->
      return new Date(parseInt(_id.substring(0,8), 16) * 1000)

   fc.getDataURL = (file, max_width, max_height, done) ->
      canvas = document.createElement("canvas")
      context = canvas.getContext("2d")
      img = new Image()
      img.onload = () ->
         w = img.width
         h = img.height

         if w > h
            if w > max_width
               h *= max_width / w
               w = max_width
         else
            if h > max_height
               w *= max_height / h
               h = max_height

         context.drawImage(img, 0, 0, w, h)
         data = canvas.toDataURL()
         done null, data

      img.src = file

   class fc.AlphaTable
      constructor: () ->
         @data = []

      load: (field, data) =>
         data._id = data[field].toLowerCase()
         index = data._id.charCodeAt(0) - 48
         @data[index] = [] unless @data[index] 
         @data[index].push(data)

      loadArray: (field, array) =>
         @load(field, data) for data in array
         
      search: (term) =>
         lower = term.toLowerCase()
         regex = new RegExp("^#{term}.*")
         index = lower.charCodeAt(0) - 48
         return unless @data[index]?.length > 0
         
         results = []
         for data in @data[index]
            results.push(data) if regex.test(data._id)

         return results

      empty: () =>
         return unless @data?.length > 0
         array?.length = 0 for array in @data
         @data.length = 0
