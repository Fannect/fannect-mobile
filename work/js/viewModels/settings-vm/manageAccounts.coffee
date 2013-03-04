do ($ = jQuery, ko = window.ko, fc = window.fannect) ->

   class fc.viewModels.Settings.ManageAccounts extends fc.viewModels.Base 
      
      constructor: () ->
         @twitter_linked = ko.observable(false)
         super

      load: () ->
         fc.user.get (err, user) => @twitter_linked(user.twitter)

      linkTwitter: () =>
         fc.user.linkTwitter (err, success) =>
            @twitter_linked(success or false)

      unlinkTwitter: () =>
         fc.user.unlinkTwitter (err, success) =>
            @twitter_linked(false) unless err
