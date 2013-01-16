do ($ = jQuery) ->
   ko.bindingHandlers.fadeIn = 
      update: (element, valueAccessor, allBindingAccessor, viewModel, bindingContext) ->
         valueUnwrapped = ko.utils.unwrapObservable valueAccessor()
         duration = allBindingAccessor().duration or 400
         if valueUnwrapped
            $(element).fadeIn duration
         else
            $(element).fadeOut duration

   ko.bindingHandlers.disableSlider = 
      update: (element, valueAccessor, allBindingAccessor, viewModel, bindingContext) ->
         valueUnwrapped = ko.utils.unwrapObservable valueAccessor()
         if valueUnwrapped
            $(element).slider "disable"
            # setTimeout (() -> $(element).slider "disable"), 300
         else
            $(element).slider "enable"

   ko.bindingHandlers.disableButton =
      update: (element, valueAccessor, allBindingAccessor, viewModel, bindingContext) ->
         valueUnwrapped = ko.utils.unwrapObservable valueAccessor()
         if valueUnwrapped
            $(element).button "disable"
         else
            $(element).button "enable"

   ko.bindingHandlers.listviewUpdate =
      update: (element, valueAccessor, allBindingAccessor, viewModel, bindingContext) ->
         ko.utils.unwrapObservable valueAccessor()
         $el = $(element)
         if $el.hasClass("ui-listview")
            $el.listview "refresh"

   ko.bindingHandlers.sliderUpdate =
      update: (element, valueAccessor, allBindingAccessor, viewModel, bindingContext) ->
         ko.utils.unwrapObservable valueAccessor()
         $(element).slider "refresh"

   ko.bindingHandlers.showPopup =
      init: (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) ->
         $(element).click () ->
            $(ko.utils.unwrapObservable valueAccessor()).popup "open", 
               transition: "pop"
               positionTo: "window"

   ko.bindingHandlers.onEnter = 
      init: (element, valueAccessor, allBindingsAccessor, viewModel) ->
         allBindings = allBindingsAccessor()
         $(element).live "keypress", (e) ->
            console.log "keypress"
            keyCode = if e.which then e.which else e.keyCode
            if (keyCode == 13)
               allBindings.onEnter.call(viewModel)
               return false
            return true


