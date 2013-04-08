do ($ = jQuery, ko = window.ko, fc = window.fannect) ->

   comparePhotos = (a, b) ->
      if a.date < b.date 
         return -1
      else if a.date > b.date
         return 1
      else
         return 0

   photoDateText = (photo) ->
     photo.date_text = dateFormat(photo.date, " mm/dd/yyyy h:MM TT")

   class fc.models.Photos

      constructor: (profile_id, name, load_now) ->
         @profile_id = profile_id
         @name = name
         @photos = ko.observableArray()
         @is_loading = ko.observable(true)
         @limit = 10
         @skip = 0
         @has_more = ko.observable(true)
         @_load_waiting = false
         @_has_loaded = false
         @load() if load_now

      setup: (profile_id) =>
         if @profile_id != profile_id
            @profile_id = profile_id
            @empty()
            @load() if @_load_waiting or @_has_loaded
            @_load_waiting = false

      reset: () =>
         @profile_id = null
         @empty()

      empty: () =>
         @photos.removeAll()
         @_has_loaded = false
         @skip = 0
         @has_more(true)
         @is_loading(true)

      load: () =>
         return unless @has_more()
         return @_load_waiting = true unless @profile_id 
         @is_loading(true)
         fc.ajax
            url: "#{fc.getResourceURL()}/v1/teamprofiles/#{@profile_id}/highlights?skip=#{@skip}&limit=#{@limit}"
         , (err, photos) =>
            @is_loading(false)
            return @has_more(false) if not photos?.length > 0 

            @skip += @limit
            
            has_results = false

            for photo in photos
               for h in @photos()
                  dupl = false
                  if h._id == photos._id
                     dupl = true
                     break
               continue if dupl
               has_results = true

               photo.date = fc.parseId(photo._id)
               photoDateText(photo)
               @photos.push(photo)

            @has_more(has_results and photos.length == @limit)
            @photos().sort(comparePhotos) if has_results
            @_has_loaded = true

      showHighlight: (highlight) =>
         $.mobile.changePage "connect-highlights-comments.html", 
            params: { highlight: highlight }
            transition: "slide"
