do ($ = window.jQuery, ko = window.ko, fc = window.fannect) ->
   $(document).bind "mobileinit", () ->
      editBio_vm = null
      editGameDaySpot_vm = null
      editBraggingRights_vm = null

      $("#profile-page").live("pagecreate", () ->
         new window.fannect.viewModels.Profile (err, vm) =>
            ko.applyBindings vm, @
      )
      .live("pageshow", () ->
         fc.mobile.addHeaderButton 
            text: "Invitations"
            position: "left"
            click: () -> $.mobile.changePage "profile-invitations.html", transition: "slidedown"

         fc.mobile.addHeaderButton 
            text: "Edit"
            position: "right"
            click: () -> $.mobile.changePage "profile-editBio.html", transition: "slide"
      )
      
      $("#profile-invitations-page").live("pagecreate", () ->
         new window.fannect.viewModels.Profile.Invitations (err, vm) =>
            ko.applyBindings vm, @
      )      

      $("#profile-invitationProfile-page").live("pagecreate", () ->
         new window.fannect.viewModels.Profile.InvitationProfile (err, vm) =>
            ko.applyBindings vm, @
      )      

      $("#profile-editBio-page").live("pagecreate", () ->
         new window.fannect.viewModels.Profile.EditBio (err, vm) =>
            editBio_vm = vm
            ko.applyBindings vm, @
      )
      .live("pageshow", () ->
         fc.mobile.addHeaderButton 
            text: "Next"
            position: "right"
            click: () -> 
               editBio_vm.next() 
               $.mobile.changePage "profile-editGameDaySpot.html", transition: "slide"
      )

      $("#profile-editGameDaySpot-page").live("pagecreate", () ->
         new window.fannect.viewModels.Profile.EditGameDaySpot (err, vm) =>
            editGameDaySpot_vm = vm
            ko.applyBindings vm, @
      )
      .live("pageshow", () ->
         fc.mobile.addHeaderButton 
            text: "Next"
            position: "right"
            click: () -> 
               editGameDaySpot_vm.next() 
               $.mobile.changePage "profile-editBraggingRights.html"
      )

      $("#profile-editBraggingRights-page").live("pagecreate", () ->
         new window.fannect.viewModels.Profile.EditBraggingRights (err, vm) =>
            editBraggingRights_vm = vm
            ko.applyBindings vm, @
      )
      .live("pageshow", () ->
         fc.mobile.addHeaderButton 
            text: "Done"
            position: "right"
            click: () -> 
               editBraggingRights_vm.updateProfile() 
               $.mobile.changePage "profile.html", transition: "slidedown"
      )