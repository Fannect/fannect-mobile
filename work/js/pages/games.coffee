do ($ = window.jQuery, ko = window.ko, fc = window.fannect) ->

   addTutorialButton = () ->
      fc.mobile.addHeaderButton 
         icon: "images/mobile/InfoButton@2x.png"
         position: "right"
         click: () -> fc.showTutorial()

   setupGuessTheScore = () ->
      $("#games-guessTheScore-page").live("pagecreate", () ->
         scroller = $(".scrolling-text", @).scroller()
         new window.fannect.viewModels.Games.GuessTheScore (err, vm) =>
            ko.applyBindings vm, @
      ).live("pageshow", () ->
         addTutorialButton()
         $(".scrolling-text", @).scroller("start")
      ).live "pagebeforehide", () ->
         $(".scrolling-text", @).scroller("stop")

   setupGameFace = () ->
      $("#games-gameFace-page").live("pagecreate", () ->
         $(".scrolling-text", @).scroller()
         new window.fannect.viewModels.Games.GameFace (err, vm) =>
            ko.applyBindings vm, @
      ).live("pageshow", () ->
         addTutorialButton()
         $(".scrolling-text", @).scroller("start")
      ).live "pagebeforehide", () ->
         $(".scrolling-text", @).scroller("stop")

   setupAttendanceStreak = () ->
      viewModel = null
      scroller = null
      $("#games-attendanceStreak-page").live("pagecreate", () ->
         scroller = $(".scrolling-text", @).scroller()
         new window.fannect.viewModels.Games.AttendanceStreak (err, vm) =>
            viewModel = vm
            if vm.no_game
               scroller.scroller("start")
            ko.applyBindings vm, @
      ).live("pageshow", () ->
         addTutorialButton()
         if viewModel?.no_game then scroller.scroller("start")
      ).live "pagebeforehide", () ->
         scroller.scroller("stop")

   $(document).bind "mobileinit", () ->
      setupGuessTheScore()
      setupGameFace()
      setupAttendanceStreak()
