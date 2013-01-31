do ($ = window.jQuery, ko = window.ko, fc = window.fannect) ->
   ko.bindingHandlers.fadeIn = 
      update: (element, valueAccessor, allBindingAccessor, viewModel, bindingContext) ->
         valueUnwrapped = ko.utils.unwrapObservable valueAccessor()
         allBindings = allBindingAccessor()
         duration = allBindings.duration or 400
         hideInstant = allBindings.hideInstant or false
         if valueUnwrapped
            $(element).fadeIn duration
         else
            if hideInstant then $(element).hide()
            else $(element).fadeOut duration

   ko.bindingHandlers.disableSlider = 
      update: (element, valueAccessor, allBindingAccessor, viewModel, bindingContext) ->
         valueUnwrapped = ko.utils.unwrapObservable valueAccessor()
         $el = $(element)

         # return early if no slider exists
         unless $el.hasClass("ui-slider-switch") then return 

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
         $el = $(element)
         if $el.hasClass("ui-slider-switch")
            $(element).slider "refresh"

   ko.bindingHandlers.showPopupOnClick =
      init: (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) ->
         $(element).click () ->
            $(ko.utils.unwrapObservable valueAccessor()).popup "open", 
               transition: "pop"
               positionTo: "window"

   ko.bindingHandlers.showPopup =
      init: (element) ->
         $(element).data("is_open", false)

      update: (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) ->
         val = ko.utils.unwrapObservable valueAccessor()
         $el = $(element)

         if $el.data("is_open") != val
            if $el.hasClass("ui-popup") 
               $el.data("is_open", val)
               if val
                  $el.popup "open",
                     transition: "pop"
                     positionTo: "window"
               else
                  $el.popup "close"

   ko.bindingHandlers.onEnter = 
      init: (element, valueAccessor, allBindingsAccessor, viewModel) ->
         allBindings = allBindingsAccessor()
         $el = $(element).live "keypress", (e) ->
            keyCode = if e.which then e.which else e.keyCode
            if (keyCode == 13)
               $el.blur()
               allBindings.onEnter.call(viewModel)
               return false
            return true

   ko.bindingHandlers.chart = 
      init: (element, valueAccessor, allBindingsAccessor, viewModel) ->
         viewModel.chart = new fc.Chart($(element))

      update: (element, valueAccessor, allBindingAccessor, viewModel, bindingContext) ->
         if viewModel.chartTimeoutId then clearTimeout(viewModel.chartTimeoutId)
         data = ko.utils.unwrapObservable valueAccessor()
         viewModel.chartTimeoutId = setTimeout (() ->
            viewModel.chart.update(data)
         ), 10

   ko.bindingHandlers.showClick = 
      init: (element, valueAccessor, allBindingsAccessor, viewModel) ->
         link = $(element).click () ->
            link.addClass("ui-btn-active")
            setTimeout (() -> link.removeClass("ui-btn-active")), 400

   ko.bindingHandlers.showListviewClick = 
      init: (element, valueAccessor, allBindingsAccessor, viewModel) ->
         link = $(element).click () ->
            parent = link.parents(".ui-btn").addClass("ui-btn-active")
            setTimeout (() -> parent.removeClass("ui-btn-active")), 400

   ko.bindingHandlers.setClass = 
      init: (element, valueAccessor, allBindingsAccessor, viewModel) ->
         c = ko.utils.unwrapObservable valueAccessor()
         $(element).addClass(c)

   ko.bindingHandlers.thumbnailSrc =
      update: (element, valueAccessor, allBindingAccessor, viewModel, bindingContext) ->
         img = ko.utils.unwrapObservable valueAccessor()
         $(element).attr("src", fc.images.getThumbnailUrl(img))

   ko.bindingHandlers.profileSrc =
      update: (element, valueAccessor, allBindingAccessor, viewModel, bindingContext) ->
         img = ko.utils.unwrapObservable valueAccessor()
         $(element).attr("src", fc.images.getProfileUrl(img))

   ko.bindingHandlers.teamSrc =
      update: (element, valueAccessor, allBindingAccessor, viewModel, bindingContext) ->
         img = ko.utils.unwrapObservable valueAccessor()
         $(element).attr("src", fc.images.getTeamUrl(img))


