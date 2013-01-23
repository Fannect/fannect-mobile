do ($ = window.jQuery, forge = window.forge, ko = window.ko) ->
   fc.user =
      _curr: null
      _subscribers: []

      get: (done) ->
         if fc.user._curr 
            done null, fc.user._curr
         else
            fc.ajax 
               url: "#{fc.getResourceURL()}/v1/me"
               type: "GET"
            , (error, data) ->
               fc.user._curr = data
               done error, data

      update: (user) ->
         if not fc.user._curr then fc.user._curr = {}
         $.extend true, fc.user._curr, user
         sub fc.user._curr for sub in fc.user._subscribers

      save: (user) ->
         if user then fc.user.update user
         # implement saving

      subscribe: (cb) ->
         fc.user._subscribers.push cb if cb