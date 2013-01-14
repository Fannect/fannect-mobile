do ($ = window.jQuery, ko = window.ko, fc = window.fannect) ->
   $(document).bind "mobileinit", () ->
      addToRosterProfile_vm = null

      $("#connect-page").live("pagecreate", () ->
         new window.fannect.viewModels.Connect (err, vm) =>
            ko.applyBindings vm, @
      )
      .live("pageshow", () ->
         fc.mobile.addHeaderButton 
            text: "Add"
            position: "right"
            click: () -> 
               $.mobile.changePage "connect-addToRoster.html", transition: "slide"
      )

      $("#connect-addToRoster-page").live("pagecreate", () ->
         new window.fannect.viewModels.Connect.AddToRoster (err, vm) =>
            ko.applyBindings vm, @
      )

      $("#connect-addToRosterProfile-page").live("pagecreate", () ->
         new window.fannect.viewModels.Connect.AddToRosterProfile (err, vm) =>
            addToRosterProfile_vm = vm
            ko.applyBindings vm, @
      )
      .live("pageshow", () ->
         fc.mobile.addHeaderButton 
            text: "Add"
            position: "right"
            click: () -> 
               addToRosterProfile_vm.addToRoster()
               $.mobile.changePage "connect.html", transition: "slidedown"
      )