do ($ = jQuery, ko = window.ko, fc = window.fannect) ->

   class fc.viewModels.Games.GameFace extends fc.viewModels.Base 
      constructor: () ->
         super
         @game_data = new fc.models.GameData()
         @meta = null

         @face_value = ko.observable "off"
         @face_on = ko.computed () => @face_value()?.toLowerCase() == "on"
         @has_saved = false

         @face_on.subscribe (newValue) =>
            return if @has_saved or @meta?.face_on or @face_value() == "off"
            @has_saved = true

            fc.team.getActive (err, profile) =>
               forge.flurry.customEvent("Play Gameface", {face_on: true})
               fc.ajax
                  url: "#{fc.getResourceURL()}/v1/me/teams/#{profile._id}/games/gameFace"
                  type: "POST"
                  data: { face_on: true }
                  cache: false
               (err) ->
                  return fc.msg.show("Something went wrong.. :(") if err
                  fc.showScoringPopup()

         @load()
            
      load: () =>
         fc.team.getActive (err, profile) =>
            return fc.msg.show("Unable to load game information!") if err
            
            fc.ajax 
               url: "#{fc.getResourceURL()}/v1/me/teams/#{profile._id}/games/gameFace"
               type: "GET"
               retry: "forever"
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