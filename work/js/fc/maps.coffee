do ($ = window.jQuery, forge = window.forge, ko = window.ko, fc = window.fannect) ->   
   fc.maps = 
      _hasLoaded: false
      _subscribers: []
      loaded: (cb) ->
         if fc.maps._hasLoaded or window.mapsLoaded
            return cb()
         else
            fc.maps._subscribers.push(cb)

      notify: () ->
         fc.maps._hasLoaded = true
         fn() for fn in fc.maps._subscribers
