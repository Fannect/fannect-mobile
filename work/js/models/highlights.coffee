do ($ = jQuery, ko = window.ko, fc = window.fannect) ->

   compareHighlights = (a, b) ->
      if a.date < b.date 
         return -1
      else if a.date > b.date
         return 1
      else
         return 0

   highlightDateText = (photo) ->
     photo.date_text = dateFormat(photo.date, " mm/dd/yyyy h:MM TT")

   class fc.models.Highlights

      constructor: (profile_id, name, load_now) ->
         @profile_id = profile_id
         @name = name
         @highlights = ko.observableArray()
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
         @highlights.removeAll()
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
         , (err, highlights) =>
            @is_loading(false)
            return @has_more(false) if not highlights?.length > 0 

            @skip += @limit
            
            has_results = false

            for highlight in highlights
               for h in @highlights()
                  dupl = false
                  if h._id == highlights._id
                     dupl = true
                     break
               continue if dupl
               has_results = true

               highlight.date = fc.parseId(highlight._id)
               highlightDateText(highlight)
               @highlights.push(highlight)

            @has_more(has_results and highlights.length == @limit)
            @highlights().sort(compareHighlights) if has_results
            @_has_loaded = true
