do ($ = jQuery, ko = window.ko, fc = window.fannect) ->

   class fc.viewModels.Games.GameFace extends fc.viewModels.Base 
      constructor: () ->
         super
         @game_data = new fc.models.GameData()
         @meta = null

         @face_value = ko.observable "off"
         @face_on = ko.computed () => @face_value()?.toLowerCase() == "on"
         
         @face_on.subscribe (newValue) =>
            return if @meta?.face_on or @face_value() == "off"
            @meta?.face_on = true

            fc.team.getActive (err, profile) =>
               fc.logger.flurry("Play Gameface")
               fc.ajax
                  url: "#{fc.getResourceURL()}/v1/me/teams/#{profile._id}/games/game_face"
                  type: "POST"
                  data: { face_on: true }
               (err) ->
                  return fc.msg.show("Something went wrong.. :(") if err

      load: () =>
         fc.team.getActive (err, profile) =>
            return fc.msg.show("Unable to load game information!") if err
            fc.ajax 
               url: "#{fc.getResourceURL()}/v1/me/teams/#{profile._id}/games/game_face"
               type: "GET"
            , (error, data) =>
               return fc.msg.show("Unable to load game information!") if error
               @meta = data.meta
               @face_value(if data.meta?.face_on then "on" else "off")
               @game_data.set(data)

      onPageShow: () =>
         super
         @face_value.valueHasMutated()
         # @available true
         # @face_value "on"
         # @face_value.notifySubscribers()