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
   
   "welcome-page":
      vm: vm.Base

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
      custom_buttons: true

   "profile-other-page":
      vm: vm.Profile.Other
      classes: ["no-padding"]
      custom_buttons: true

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
      vm: vm.Base
      buttons: [
         {
            position: "right"
            text: "Share"
            click: -> $.mobile.changePage "share.html", transition:"slide"
         }
      ]
      # classes: ["light-background"]
      
   "connect-roster-page":
      vm: vm.Connect.Roster
      buttons: [
         {
            position: "right"
            text: "FB Friends"
            # icon: "images/icons/find_FacebookIcon@2x.png"
            click: -> $.mobile.changePage "connect-roster-facebookFriends.html", transition:"slide"
         }
      ]
      classes: ["light-background"]
      auto_scroll: true
 
   "connect-roster-facebookFriends-page":
      vm: vm.Connect.Roster.FacebookFriends
      buttons: [
         {
            position: "right"
            text: "Send"   
         }
      ]
      classes: ["dark-background"]
      
   "connect-huddle-page":
      vm: vm.Connect.Huddle
      buttons: [
         {
            position: "right"
            text: "New"
            click: -> $.mobile.changePage "connect-huddle-newTopic.html", transition: "slidedown"
         }
      ]
      classes: ["light-background"]
      auto_scroll: true

   "connect-huddle-newTopic-page":
      vm: vm.Connect.Huddle.NewTopic
      buttons: [
         {
            position: "right"
            text: "Huddle Up"
            tint: [193, 39, 45, 160]
         }
      ]
      classes: ["light-background"] 

   "connect-huddle-tagTeams-page":
      vm: vm.Connect.Huddle.TagTeams
      buttons: [
         {
            position: "right"
            text: "Tag"
            # tint: [193, 39, 45, 160]
         }
      ]
      classes: ["dark-background"] 

   "connect-huddle-newReply-page":
      vm: vm.Connect.Huddle.NewReply
      buttons: [
         {
            position: "right"
            text: "Post"
            tint: [193, 39, 45, 160]
         }
      ]
      classes: ["light-background"] 

   "connect-huddle-replies-page":
      vm: vm.Connect.Huddle.Replies
      buttons: [
         {
            position: "right"
            text: "Reply"
         }
      ]
      classes: ["light-background"] 
      auto_scroll: true

   "connect-highlights-page": 
      vm: vm.Connect.Highlights
      buttons: [
         {
            position: "right"
            icon: "images/icons/CameraIcon@2x.png"
            click: -> $.mobile.changePage "connect-highlights-upload.html", transition: "slidedown"
         }
      ]
      classes: ["light-background"]
      auto_scroll: true

   "connect-highlights-share-page": 
      vm: vm.Connect.Highlights.Share
      classes: ["light-background"]

   "connect-highlights-comments-page": 
      vm: vm.Connect.Highlights.Comments
      classes: ["light-background"]

   "connect-highlights-upload-page": 
      vm: vm.Connect.Highlights.Upload
      classes: ["light-background"]

   ###
   # Games
   ###
   "games-page":
      vm: vm.Games
      classes: ["light-background"]
      auto_scroll: true

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

   "games-photo-gamedayPics-page":
      vm: vm.Games.GamedayPics
      buttons: [
         {
            text: "Rules"
            position: "right"
            click: () -> window.fannect.tutorial.show()
         }
      ]
      classes: ["photo-base"]

   "games-photo-photoChallenge-page":
      vm: vm.Games.PhotoChallenge
      buttons: [
         {
            text: "Rules"
            position: "right"
            click: () -> window.fannect.tutorial.show()
         }
      ]
      classes: ["photo-base"]

   "games-photo-spiritWear-page":
      vm: vm.Games.SpiritWear
      buttons: [
         {
            text: "Rules"
            position: "right"
            click: () -> window.fannect.tutorial.show()
         }
      ]
      classes: ["photo-base"]

   "games-photo-pictureWithPlayer-page":
      vm: vm.Games.PictureWithPlayer
      buttons: [
         {
            text: "Rules"
            position: "right"
            click: () -> window.fannect.tutorial.show()
         }
      ]
      classes: ["photo-base"]

   "games-photo-chooseInstagram-page":
      vm: vm.Games.ChooseInstagram
      classes: ["light-background"]

   "games-photo-afterSubmit-page":
      vm: vm.Games.AfterSubmit
      classes: ["light-background"]

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
