do ($ = jQuery, ko = window.ko, fc = window.fannect) ->

   SPACE_ABOVE = if forge.is.android() then 100 else 40 

   # element absolute position
   # index * offset * element_height

   class fc.models.Infinite

      constructor: (options = {}) ->
         @url = options.url
         @top_offset = options.top_offset or 0
         @element_height = options.element_height
         @view_height = $(window).height() - @top_offset
         @visible_above = Math.ceil(SPACE_ABOVE / @element_height) 
         @visible_count = Math.ceil(@view_height / @element_height) + 2 * @visible_above
         @limit = options.limit
         @skip = 0

         @data = []
         @offset = ko.observable(0)
         @visible = ko.observableArray()
         @loading = ko.observable()
         @container_height = 0

         @_setOffset()
         @load()

      load: () =>
         @loading(true)
         fc.ajax
            url: @_getUrl(@url)
            type: "GET"
            retry: "forever"
         , (err, results) =>
            @loading(false)
            return if err

            if @limit

            else
               @data = results
               @_setContainerHeight()
               @_setVisible()


      bind: () =>
         movement = () =>
            @_setOffset()
            @_setVisible()

         $window = $(window).bind "scroll.infinite", movement
         $doc = $(document).bind "touchmove.infinite", movement
            # if not @loading() and $window.scrollTop() > $(document).height() - $window.height() - 150
            #    @loading true
            #    @load()


      unbind: () -> 
         $(window).unbind("scroll.infinite")
         $(document).unbind("touchmove.infinite")

      _setContainerHeight: () =>
         @container_height = @data.length * @element_height

      _setOffset: () =>
         offset = $(window).scrollTop() - @top_offset
         offset = 0 if offset < 0
         @offset(offset)

      _setVisible: () =>
         return if @data.length == 0

         first = @_calculateFirst()
         last = first + @visible_count-1
         # @visible.removeAll()
         # for i in [first..last] by 1
         #    unless @data[i]
         #       console.log "length", @data.length
         #       console.log "i", i
         #    @visible.push({ index: i, data: @data[i] })

         # Optimize - If we are more than half way of recreate
         if @visible().length == 0 or Math.abs(@visible()[0].index - first) > @visible_count * 0.4
            @visible.removeAll()
            for i in [first..last] by 1
               @visible.push({ index: i, data: @data[i] })

         else
            if (vis = @visible()[0].index) > first 
               # add elements to beginning  
              
               for i in [vis-1..first] by -1
                  @visible.unshift({ index: i, data: @data[i] })

               # remove elements at the end
               @visible().length = @visible_count

            else if (vis = @visible()[0].index) < first
               # remove elements from beginning
               @visible.splice(0, first - vis)
               # add elements to end
               for i in [vis + @visible_count..last]
                  @visible.push({ index: i, data: @data[i] })

      _getUrl: () =>
         return @url

      _calculateFirst: () =>
         firstVisible = Math.floor((@offset() / @element_height) - @visible_above)
         
         # Correct if above available items
         firstVisible = 0 if firstVisible < 0

         # Correct if below available items
         if firstVisible + @visible_count-1 > @data.length - 1 
            firstVisible = @data.length-1 - @visible_count-1 

         return firstVisible


