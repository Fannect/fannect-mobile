vm = window.fannect.viewModels

window.fannect.pages =

   ##
   # Login
   ##
   "index-page":
      vm: vm.Login

   "createAccount-page":
      vm: vm.CreateAccount

   "linkAccounts-page":
      vm: vm.LinkAccounts

   ##
   # Reset Password
   ##
   "resetPassword-page":
      vm: vm.ResetPassword

   "resetPassword-setPassword-page":
      vm: vm.ResetPassword.SetPassword

   "resetPassword-submitTemporary-page":
      vm: vm.ResetPassword.SubmitTemporary

   ###
   # Profile
   ###
   "profile-page": 
      vm: vm.Profile
      classes: ["no-padding"]

   "profile-other-page":
      vm: vm.Profile.Other
      classes: ["no-padding"]

   "profile-invites-page":
      vm: vm.Profile.Invites
      buttons: [
         {
            position: "right"
            icon: "images/icons/RefreshIcon@2x.png"
         }
      ]
      classes: ["light-background"]

   "profile-chooseWebImage-page":
      vm: vm.Profile.ChooseWebImage
      classes: ["light-background"]
   
   "profile-shout-page":
      vm: vm.Profile.Shout
      classes: ["light-background"]
      buttons: [
         {
            position: "right"
            text: "Shout It!"
            tint: [193, 39, 45, 160]
         }
      ]
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
      vm: vm.Base
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
      buttons: [
         {
            position: "right"
            text: "Share"
         }
      ]
      classes: ["light-background"]
      auto_scroll: true

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
      vm: vm.Games
      classes: ["light-background"]

   "games-guessTheScore-page":
      vm: vm.Games.GuessTheScore
      buttons: [
         {
            text: "Rules"
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
            text: "Rules"
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
            text: "Rules"
            position: "right"
            click: () -> window.fannect.tutorial.show()
         }
      ]
      scroller: true
      classes: ["no-padding"]

   "games-gameFace-motivateSelect-page":
      vm: vm.Games.GameFace.MotivateSelect
      buttons: [
         {
            position: "right"
            text: "Motivate!"
            tint: [193, 39, 45, 160]
         }
      ]
      classes: ["light-background"]

   # "games-gameFace-motivateMessage-page":
   #    vm: vm.Games.GameFace.MotivateMessage
   #    classes: ["light-background"]

   ###
   # Leaderboard
   ###
   "leaderboard-page": 
      vm: vm.Leaderboard
      classes: ["light-background"]
   
   "leaderboard-league-page": 
      vm: vm.Leaderboard.League
      classes: ["light-background"]
      auto_scroll: true

   "leaderboard-breakdown-page":
      vm: vm.Leaderboard.Breakdown
      classes: ["light-background", "no-padding"]

   "leaderboard-breakdownOther-page":
      vm: vm.Leaderboard.BreakdownOther
      classes: ["light-background", "no-padding"]

   "leaderboard-myRoster-page":
      vm: vm.Leaderboard.MyRoster
      classes: ["light-background"]
      auto_scroll: true

   "leaderboard-overallFans-page":
      vm: vm.Leaderboard.OverallFans
      classes: ["light-background"]
      auto_scroll: true

   ###
   # Settings
   ###
   "settings-page":
      classes: []

   "settings-manageProfiles-page":
      vm: vm.Settings.ManageProfiles
      buttons: [
         {
            position: "right"
            text: "Add"
         }
      ]
      classes: ["dark-background"]

   "settings-account-page":
      vm: vm.Settings.Account

   "settings-manageAccounts-page":
      vm: vm.Settings.ManageAccounts

   "settings-privacy-page":
      classes: ["light-background"]

   "settings-verified-page": 
      classes: []

   "settings-verified-player-page":
      vm: vm.Settings.Verified.Player 

   "settings-verified-coach-page":
      vm: vm.Settings.Verified.Coach

   "settings-verified-authority-page":
      vm: vm.Settings.Verified.Authority

   ###
   # Share
   ###
   "share-page":
      vm: vm.Share
      classes: ["light-background"]

   "share-email-page":
      classes: ["light-background"]

   "share-sms-page":
      vm: vm.Share.SMS
      classes: ["light-background"]