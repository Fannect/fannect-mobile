do ($ = jQuery, ko = window.ko, fc = window.fannect) ->

   class fc.viewModels.Connect.Huddle.NewTopic extends fc.viewModels.Base 

      constructor: () ->
         super
         @topic = ko.observable("")
         @message = ko.observable("")

      selectImage: () =>
      selectTeams: () =>

      rightButtonClick: () =>
         return fc.msg.show("Enter a topic!") if @topic().length == 0
         return fc.msg.show("Enter a message!") if @message().length == 0

         fc.msg.loading("Creating huddle...")
         fc.team.getActive (err, profile) =>
            fc.ajax 
               url: "#{fc.getResourceURL()}/v1/teams/#{profile.team_id}/huddles"
               type: "POST"
               data: 
                  team_profile_id: profile._id
                  topic: @topic()
                  content: @message()
            , (err, resp) =>
               if err or resp.status == "error"
                  return fc.msg.show("Couldn't create huddle at this time!")
               else
                  setTimeout (() => 
                     @topic("")
                     @message("")
                  ), 200
                  fc.nav.goBack("flip", { new_huddle: true })