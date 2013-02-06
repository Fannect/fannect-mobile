do ($ = jQuery, ko = window.ko, fc = window.fannect) ->

   class fc.viewModels.Base
      constructor: () -> 
         @is_showing = ko.observable false
         # @has_twitter = ko.observable false

         # fc.user.get (err, user) =>
         #    @has_twitter(user?.twitter?.screen_name?.length > 0 or false)

      onPageShow: () => @is_showing true
      onPageHide: () => @is_showing false
      leftButtonClick: () -> throw new Error "Left button click not implemented!"
      rightButtonClick: () -> throw new Error "Right button click not implemented!"
