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

   ko.bindingHandlers.slideInOut = 
      update: (element, valueAccessor, allBindingAccessor, viewModel, bindingContext) ->
         valueUnwrapped = ko.utils.unwrapObservable valueAccessor()
         allBindings = allBindingAccessor()
         duration = allBindings.duration or 400
         if valueUnwrapped
            $(element).slideDown duration
         else
            $(element).slideUp duration

   ko.bindingHandlers.setFocusBlur =
      update: (element, valueAccessor, allBindingAccessor, viewModel, bindingContext) ->
         valueUnwrapped = ko.utils.unwrapObservable valueAccessor()
         allBindings = allBindingAccessor()
         if valueUnwrapped
            $(element).focus()
         else
            $(element).blur()


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

   ko.bindingHandlers.onEnterOrBlur = 
      init: (element, valueAccessor, allBindingsAccessor, viewModel) ->
         allBindings = allBindingsAccessor()
         $el = $(element).live "keypress", (e) ->
            keyCode = if e.which then e.which else e.keyCode
            if (keyCode == 13)
               $el.blur()
               return false
            return true

         $el = $el.live "blur", () ->
            allBindings.onEnterOrBlur.call(viewModel)

   ko.bindingHandlers.chart = 
      init: (element, valueAccessor, allBindingsAccessor, viewModel) ->
         allBindings = allBindingsAccessor()
         options = allBindings.chartOptions or {}
         viewModel.chart = new fc.Chart($(element), options)
         
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
            setTimeout (() -> link.removeClass("ui-btn-active")), 250

   ko.bindingHandlers.showListviewClick = 
      init: (element, valueAccessor, allBindingsAccessor, viewModel) ->
         link = $(element).click () ->
            parent = link.parents(".ui-btn").addClass("ui-btn-active")
            setTimeout (() -> parent.removeClass("ui-btn-active")), 400

   ko.bindingHandlers.setClass = 
      init: (element, valueAccessor, allBindingsAccessor, viewModel) ->
         c = ko.utils.unwrapObservable valueAccessor()
         $(element).addClass(c?.replace(/_/g,"-"))

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

   ko.bindingHandlers.forceFocus =
      update: (element, valueAccessor, allBindingAccessor, viewModel, bindingContext) ->
         val = ko.utils.unwrapObservable valueAccessor()
         if val
            setTimeout (-> $(element).focus()), 300
         else
            $(element).blur() 

   ko.bindingHandlers.valueWithInit = 
      init: (element, valueAccessor, allBindingsAccessor, context) ->
         observable = valueAccessor()
         value = element.value;
         observable(value)

         ko.bindingHandlers.value.init(element, valueAccessor, allBindingsAccessor, context)
      update: ko.bindingHandlers.value.update


   ko.bindingHandlers.textToken =
      update: (element, valueAccessor, allBindingAccessor, viewModel, bindingContext) ->
         options = ko.utils.unwrapObservable valueAccessor()
         $el = $(element) 
        
         if (source = ko.utils.unwrapObservable(options.source)) and source.length > 0 and not $el.data("textToken-init")
            $el.data("textToken-init", true)
            $el.tokenInput source,
               onAdd: () -> options.value($el.tokenInput("get"))
               hintText: false
               searchingText: false
               resultsFilter: options.filterFn

   ko.bindingHandlers.swipe = 
      init: (element, valueAccessor, allBindingsAccessor, viewModel) ->
         options = ko.utils.unwrapObservable valueAccessor()

         setup = () ->
            unless $(element).is(":visible")
               return setTimeout(setup, 10) 

            index = 0
            
            next = $(".next", element).click (e) ->
               if slider.getPos() < options.count - 1
                  e.stopPropagation()
                  slider.next()

            prev = $(".prev", element).addClass("inactive").click (e) ->
               if slider.getPos() > 0
                  e.stopPropagation()
                  slider.prev()

            title = $(".title", element)
            sliderElement = $(".swipe-wrap", element).addClass("count-#{options.count}")
            
            onSlideEnd = (e, i, active) ->
               # called at the end of every transition
               prevIndex = index
               index = i

               active = $(active)

               options.show(index, active.data("is_init") or false)
               $(slider.slides).removeClass("active").addClass("inactive")
               active.addClass("active").removeClass("inactive").data("is_init", true)
               
               # Change title
               title.text(options.titles[index]).fadeIn(300)

               if prevIndex != index
                  options.hide(prevIndex)

               if index == 0
                  prev.addClass("inactive")
               else
                  prev.removeClass("inactive")

               if index == options.count - 1 
                  next.addClass("inactive")
               else
                  next.removeClass("inactive")

            slider = new Swipe sliderElement.get(0), 
               speed: 500 
               callback: onSlideEnd
               onSlideStart: () ->
                  title.fadeOut 300

            onSlideEnd(null, slider.getPos(), slider.element)
               
         setup()

         



