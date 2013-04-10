do ($ = jQuery, ko = window.ko, fc = window.fannect) ->

   class fc.viewModels.Connect.Highlights.Upload extends fc.viewModels.Base 
         
      spiritWear: () =>
         fc.nav.removeCurrent()
         fc.nav.buildHistory("games", [  
            new fc.nav.HistoryEntry("games-photo-spiritWear.html", "slide")
         ], { transition: "slidedown" })

      gamedayPics: () =>
         fc.nav.removeCurrent()
         fc.nav.buildHistory("games", [  
            new fc.nav.HistoryEntry("games-photo-gamedayPics.html", "slide")
         ], { transition: "slidedown" })

      photoChallenge: () =>
         fc.nav.removeCurrent()
         fc.nav.buildHistory("games", [  
            new fc.nav.HistoryEntry("games-photo-photoChallenge.html", "slide")
         ], { transition: "slidedown" })

      pictureWithPlayer: () =>
         fc.nav.removeCurrent()
         fc.nav.buildHistory("games", [  
            new fc.nav.HistoryEntry("games-photo-pictureWithPlayer.html", "slide")
         ], { transition: "slidedown" })
