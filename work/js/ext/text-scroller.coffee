do ($ = jQuery) ->
   Scroller = 
      _create: () ->
         @options.text = @element.text()
         @element.empty().addClass("ui-scroller").append("<div class='cover'></div>")
         textWrap = $("<div class='text-wrap'></div>").appendTo(@element)
         @options._first = $("<span class='text'>" + @options.text + "</span>").appendTo(textWrap)
         @options._second = $("<span class='text'>" + @options.text + "</span>").appendTo(textWrap)

      start: () ->
         # $.support.cssTransitions
         @options._first.css "left", @options.start_offset 
         @options._second.css "left", @options.start_offset + @options._first.width() + @options.space_offset
         @_resetFirst()
         @_resetSecond()

      stop: () ->
         @options._first.stop true
         @options._second.stop true
         clearTimeout @options_hidden_timeout_id
         @options._is_hidden = true

      _startScroll: (current, next, cb) ->
         width = current.width()
         offset = current.position().left

         unless @element.is ":visible"
            return @_hiddenLoop()

         if $.support.cssTransitions and @.options?.hardware_accelerated
            current.addClass("moving").css(
               "left": -1*width
               "transition-duration": (width+offset)*@options.rate+"ms"
               "-webkit-transition-duration": (width+offset)*@options.rate+"ms"
               "-moz-transition-duration": (width+offset)*@options.rate+"ms"
               "-o-transition-duration": (width+offset)*@options.rate+"ms"
            ).one "transitionend webkitTransitionEnd oTransitionEnd", () =>
               current.removeClass("moving")
               current.css("left", next.position().left+next.width()+@options.space_offset)
               cb.call @
         else
            current.animate { left: -1*width }, (width+offset)*@options.rate, "linear", () =>
               current.css("left", next.position().left+next.width()+@options.space_offset)
               cb.call @

      _resetFirst: () ->
         @_startScroll(@options._first, @options._second, @_resetFirst)

      _resetSecond: () ->
         @_startScroll(@options._second, @options._first, @_resetSecond)

      _hiddenLoop: () ->
         unless @options._hidden_timeout_id
            @options._hidden_timeout_id = setTimeout (() => @_checkForVisible.call @), 600

      _checkForVisible: () ->
         @options._hidden_timeout_id = null
         
         if @element.is ":visible"
            @start()
         else
            @_hiddenLoop()

      options:
         _first: null
         _second: null
         _is_stopped: false
         _hidden_timeout_id: null
         start_offset: 10
         space_offset: 25
         rate: 20
         hardware_accelerated: false
         text: null

   $(document).on "mobileinit", () ->
      $.widget "ui.scroller", Scroller