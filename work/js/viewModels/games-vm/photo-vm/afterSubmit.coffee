do ($ = jQuery, ko = window.ko, fc = window.fannect) ->

   class fc.viewModels.Games.AfterSubmit extends fc.viewModels.Base 
      constructor: () ->
         super
         
      uploadMore: () =>
         fc.nav.goBack()
      
      viewAll: () =>
         fc.nav.clearHistory("games")
         fc.nav.buildHistory("connect", [  
            new fc.nav.HistoryEntry("connect-highlights.html", "slide")
         ], { transition: "slidedown", params: { created_by: @params.type } })