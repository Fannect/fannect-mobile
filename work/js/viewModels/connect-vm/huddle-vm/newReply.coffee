do ($ = jQuery, ko = window.ko, fc = window.fannect) ->

   class fc.viewModels.Connect.Huddle.NewReply extends fc.viewModels.Base 

      constructor: () ->
         super
         @huddle_id = null
         @message = ko.observable()
         @topic = ko.observable("HEY")
         @owner = ko.observable()
         
      load: () =>
         return fc.nav.backToRoot("connect") unless @params.huddle_id
         huddle_id = @params.huddle_id
         if @huddle_id != @params.huddle_id
            @huddle_id = @params.huddle_id
            @topic("")
            @owner("")
            fc.team.getActive (err, profile) =>
               fc.ajax
                  url: "#{fc.getResourceURL()}/v1/huddles/#{@params.huddle_id}"
                  type: "GET"
               , (err, huddle) =>
                  return fc.msg.show("Unable to load huddle information") if err or huddle?.status == "fail"
                  return unless huddle_id == @huddle_id
                  @topic(huddle.topic)
                  @owner(huddle.owner_name)
                  
      rightButtonClick: () =>
         return fc.msg.show("Enter a message!") if @message().length == 0

         fc.msg.loading("Replying...")
         fc.team.getActive (err, profile) =>
            fc.ajax 
               url: "#{fc.getResourceURL()}/v1/huddles/#{@params.huddle_id}/replies"
               type: "POST"
               data: 
                  team_profile_id: profile._id
                  content: @message()
            , (err, resp) =>
               fc.msg.hide()
               if err or resp.status == "error"
                  return fc.msg.show("Couldn't reply at this time!")
               else
                  setTimeout (() => @message("")), 200
                  fc.nav.goBack("flip", { new_reply: resp.reply })
