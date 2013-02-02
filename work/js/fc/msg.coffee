do ($ = window.jQuery, forge = window.forge, ko = window.ko, fc = window.fannect) ->
   fc.msg =
      show: (msg, autohide = 1500) ->
         $.mobile.loading "show",
            text: msg
            textonly: true
            textVisible: true
            theme: "a"

         if autohide then setTimeout (-> $.mobile.loading("hide")), autohide

      loading: (msg) ->
         $.mobile.loading "show",
            text: msg
            textVisible: true
            theme: "a"

      hide: () -> $.mobile.loading("hide")
      showNoAccess: () -> fc.msg.show("Attempting to reconnect...", false)