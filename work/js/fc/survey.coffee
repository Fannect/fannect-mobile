do ($ = window.jQuery, forge = window.forge, ko = window.ko, fc = window.fannect) ->
   
   fc.survey =
      show: () ->
         fc.user.get (err, user) ->
            userDate = parseInt(user._id.toString().substring(0,8), 16) * 1000
            twoWeeksAgo = (new Date() / 1) - (1000 * 60 * 24 * 14)

            if not user.taken_survey and userDate <= twoWeeksAgo
               setTimeout ->
                  $(".surveyPopup", $.mobile.activePage).popup("open")
               , 1000

      submitResults: (response, additional) ->
         $(".surveyPopup", $.mobile.activePage).popup("close")
         fc.user.update({ taken_survey: true })
         data = { response: response }
         data.additional = additional if additional
         fc.ajax
            url: "#{fc.getResourceURL()}/v1/me/survey"
            type: "POST"
            data: data
