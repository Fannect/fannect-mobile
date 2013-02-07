do ($ = window.jQuery, forge = window.forge, ko = window.ko, fc = window.fannect) ->
   window.mapsInitialized = () ->
      fc.maps._hasLoaded = true
      fn() for fn in fc.maps._subscribers
      
   fc.maps = 
      _hasLoaded: false
      _subscribers: []
      loaded: (cb) ->
         if fc.maps._hasLoaded
            return cb()
         else
            fc.maps._subscribers.push(cb)
