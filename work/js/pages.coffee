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
      scroller: false
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
      buttons: []
      no_cache: true
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
      buttons: [
         {
            position: "right"
            icon: "images/mobile/ShareGlyph@2x.png"
         }
      ]
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
   "leaderboard-page": 
      vm: vm.Leaderboard
      classes: ["light-background"]
   "leaderboard-users-page":
      vm: vm.Leaderboard.Users
      classes: ["light-background"]

   "leaderboard-conference-page": 
      vm: vm.Leaderboard.Conference
      classes: ["light-background"]

   "leaderboard-league-page": 
      vm: vm.Leaderboard.League
      classes: ["light-background"]

   "leaderboard-breakdown-page":
      vm: vm.Leaderboard.Breakdown
      classes: ["light-background", "no-padding"]

   "leaderboard-breakdownOther-page":
      vm: vm.Leaderboard.BreakdownOther
      classes: ["light-background", "no-padding"]

   "leaderboard-myRoster-page":
      vm: vm.Leaderboard.MyRoster
      classes: ["light-background"]

   "leaderboard-overallFans-page":
      vm: vm.Leaderboard.OverallFans
      classes: ["light-background"]

   ###
   # Settings
   ###
   "settings-removeProfiles-page":
      vm: vm.Settings.RemoveProfiles
      classes: ["dark-background"]

   "settings-account-page":
      vm: vm.Settings.Account

   "settings-manageAccounts-page":
      vm: vm.Settings.ManageAccounts

   "settings-privacy-page":
      classes: ["light-background"]

   "share-page":
      vm: vm.Share
      classes: ["light-background"]

