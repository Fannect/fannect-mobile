do ($ = jQuery, ko = window.ko, fc = window.fannect) ->

   class fc.viewModels.Base
      constructor: () -> @is_showing = ko.observable false
      onPageShow: () -> @is_showing true
      onPageHide: () -> @is_showing false
      leftButtonClick: () -> throw "Left button click not implemented!"
      rightButtonClick: () -> throw "Right button click not implemented!"
