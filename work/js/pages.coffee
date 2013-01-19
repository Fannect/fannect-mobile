vm = window.fannect.viewModels

window.fannect.pages =

   ###
   # Login
   ###
   # "index-page":
   #    vm: vm.Login

   ###
   # Profile
   ###
   "profile-page": 
      vm: vm.Profile
      buttons: [
         {
            position: "left"
            icon: "images/mobile/rosterInviteIcon.png"
         }, {
            position: "right"
            text: "Edit"
         }
      ]
      scroller: false

   "profile-invitations-page":
      vm: vm.Profile.Invitations
      classes: ["light-background"]
   
   "profile-invitationProfile-page":
      vm: vm.Profile.InvitationProfile
   
   "profile-chooseWebImage-page":
      vm: vm.Profile.ChooseWebImage
      classes: ["light-background"]
   
   ###
   # Connect
   ###
   "connect-page":
      vm: vm.Connect
      buttons: [
         {
            position: "right"
            text: "Add"
         }
      ]
      classes: ["light-background"]

   "connect-addToRoster-page":
      vm: vm.Connect.AddToRoster
      classes: ["light-background"]

   "connect-addToRosterProfile-page":
      vm: vm.Connect.AddToRosterProfile
      buttons: [
         {
            position: "right"
            text: "Add"
         }
      ]

   ###
   # Games
   ###
   "games-page":
      classes: ["light-background"]

   "games-guessTheScore-page":
      vm: vm.Games.GuessTheScore
      buttons: [
         {
            icon: "images/mobile/InfoButton@2x.png"
            position: "right"
            click: () -> window.fannect.showTutorial()
         }
      ]
      scroller: true

   "games-gameFace-page":
      vm: vm.Games.GameFace
      buttons: [
         {
            icon: "images/mobile/InfoButton@2x.png"
            position: "right"
            click: () -> window.fannect.showTutorial()
         }
      ]
      scroller: true

   "games-attendanceStreak-page":
      vm: vm.Games.AttendanceStreak
      buttons: [
         {
            icon: "images/mobile/InfoButton@2x.png"
            position: "right"
            click: () -> window.fannect.showTutorial()
         }
      ]
      scroller: true

   ###
   # Leaderboard
   ###
   "leaderboard-page":
      vm: vm.Leaderboard
      buttons: [
         {
            position: "left"
            text: "Overall"
            tint: [193,39,45,255]
         }, {
            position: "right"
            text: "Roster"
            tint: [120,120,120,255]
         }
      ]
      classes: ["light-background"]
