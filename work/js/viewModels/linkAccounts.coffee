do ($ = jQuery, ko = window.ko, fc = window.fannect) ->

   class fc.viewModels.LinkAccounts extends fc.viewModels.Base 
      
      constructor: () ->
         @twitter_linked = ko.observable(false)
         @instagram_linked = ko.observable(false)
         @facebook_linked = ko.observable(false)
         super

      load: () =>
         fc.user.get (err, user) => 
            @twitter_linked(user.twitter)
            @instagram_linked(user.instagram)
            @facebook_linked(user.facebook)

      linkTwitter: () =>
         fc.user.linkTwitter (err, success) =>
            @twitter_linked(success or false)

      unlinkTwitter: () =>
         fc.user.unlinkTwitter (err, success) =>
            @twitter_linked(false) unless err

      linkFacebook: () =>
         fc.user.linkFacebook (err, success) =>
            @facebook_linked(success or false)

      unlinkFacebook: () =>
         fc.user.unlinkFacebook (err, success) =>
            @facebook_linked(false) unless err