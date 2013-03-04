do ($ = jQuery, ko = window.ko, fc = window.fannect) ->

   class fc.viewModels.Base
      constructor: () -> 
         @is_showing = ko.observable false
         @previous_scroll_top = 0
         @has_loaded = false
         @url = null
         @params = null
         # @has_twitter = ko.observable false

         # fc.user.get (err, user) =>
         #    @has_twitter(user?.twitter?.screen_name?.length > 0 or false)

      load: () => @has_loaded = true
      onPageShow: () => @is_showing true
      onPageHide: () => @is_showing false
      leftButtonClick: () -> throw new Error "Left button click not implemented!"
      rightButtonClick: () -> throw new Error "Right button click not implemented!"
