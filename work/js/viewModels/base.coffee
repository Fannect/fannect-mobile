do ($ = jQuery, ko = window.ko, fc = window.fannect) ->

   class fc.viewModels.Base
      constructor: () -> 
         @is_showing = ko.observable false
         @previous_scroll_top = 0
         @has_loaded = false
         @url = null
         @params = null
         
         # Handle survey response
         @survey_step = ko.observable("question")
         @survey_additional = ko.observable()
         @survey_response = ko.observable()
         @survey_response.subscribe () =>
            if @survey_response() == "not disappointed" then @survey_step("additional")
            else fc.survey.submitResults(@survey_response())

      load: () => @has_loaded = true
      onPageShow: () => @is_showing true
      onPageHide: () => @is_showing false
      leftButtonClick: () -> throw new Error "Left button click not implemented!"
      rightButtonClick: () -> throw new Error "Right button click not implemented!"

      cancelSurvey: () => fc.survey.submitResults("cancelled")
      submitSurvey: () => fc.survey.submitResults(@survey_response(), @survey_additional())


