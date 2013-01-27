vm = window.fannect.viewModels

window.fannect.pages =

   ###
   # Login
   ###
   "index-page":
      vm: vm.Login
      buttons: [
         {
            position: "right"
            text: "Create Account"
         }
      ]

   "createAccount-page":
      vm: vm.CreateAccount

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
      classes: ["no-padding"]

   "profile-invitations-page":
      vm: vm.Profile.Invitations
      classes: ["light-background"]
   
   "profile-invitationProfile-page":
      vm: vm.Profile.InvitationProfile
      classes: ["no-padding"]
   
   "profile-chooseWebImage-page":
      vm: vm.Profile.ChooseWebImage
      buttons: [
         {
            position: "right"
            text: "Done"
            style: "done"
         }
      ]
      classes: ["light-background"]
   
   ###
   # Select Team
   ###
   "profile-selectTeam-page":
      vm: vm.Profile.SelectTeam
      buttons: [
         {
            position: "right"
            text: "Add"
         }
      ]
      classes: ["dark-background"]

   "profile-selectTeam-chooseSport-page":
      vm: vm.Profile.SelectTeam.ChooseSport
      classes: ["dark-background"]

   "profile-selectTeam-chooseMethod-page":
      classes: ["dark-background"]

   "profile-selectTeam-chooseLeague-page":
      vm: vm.Profile.SelectTeam.ChooseLeague
      classes: ["dark-background"]

   "profile-selectTeam-chooseTeam-page":
      vm: vm.Profile.SelectTeam.ChooseTeam
      classes: ["dark-background"]

   "profile-selectTeam-search-page":
      vm: vm.Profile.SelectTeam.Search
      classes: ["dark-background"]

   ###
   # Connect
   ###
   "connect-page":
      vm: vm.Connect
      classes: ["light-background"]

   "connect-connectProfile-page":
      vm: vm.Connect.ConnectProfile
      buttons: [
         {
            position: "right"
            text: "Add"
         }
      ]
      classes: ["no-padding"]      

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
            click: () -> window.fannect.tutorial.show()
         }
      ]
      scroller: true
      classes: ["no-padding"]

   "games-gameFace-page":
      vm: vm.Games.GameFace
      buttons: [
         {
            icon: "images/mobile/InfoButton@2x.png"
            position: "right"
            click: () -> window.fannect.tutorial.show()
         }
      ]
      scroller: true
      classes: ["no-padding"]

   "games-attendanceStreak-page":
      vm: vm.Games.AttendanceStreak
      buttons: [
         {
            icon: "images/mobile/InfoButton@2x.png"
            position: "right"
            click: () -> window.fannect.tutorial.show()
         }
      ]
      scroller: true
      classes: ["no-padding"]

   ###
   # Leaderboard
   ###
   "leaderboard-page": classes: ["light-background"]
   "leaderboard-users-page":
      vm: vm.Leaderboard.Users
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
