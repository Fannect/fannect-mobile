do ($ = window.jQuery, forge = window.forge, ko = window.ko, fc = window.fannect) ->
   fc.cache =
      _cache: {}
      get: (key) -> fc.cache._cache[key]
      set: (key, val) -> fc.cache._cache[key] = val
      hasKey: (key) -> fc.cache._cache[key]?
      pull: (key) ->
         val = fc.cache._cache[key]
         fc.cache._cache[key] = null
         return val