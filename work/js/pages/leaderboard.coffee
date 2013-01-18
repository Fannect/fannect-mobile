$(document).bind "mobileinit", () ->
   leaderboard_vm = null
   overall_active = true

   $("#leaderboard-page").live("pagecreate", () ->
      new window.fannect.viewModels.Leaderboard (err, vm) =>
         leaderboard_vm = vm
         ko.applyBindings vm, @
   ).live("pageshow", () ->
      createOverallButton(true)
      createRosterButton(false)
   )

   $("#leaderboard-rosterProfile-page").live("pagecreate", () ->
      new window.fannect.viewModels.Leaderboard.RosterProfile (err, vm) =>
         ko.applyBindings vm, @
   )

   createOverallButton = (active) ->
      window.fannect.mobile.addHeaderButton 
         text: "Overall"
         position: "left"
         tint: if active then [193, 39, 45, 255] else [120,120,120,255]
         click: () ->
            unless overall_active
               leaderboard_vm.selected_view("overall")
               overall_active = true
               forge.topbar.removeButtons () ->
                  createOverallButton(true)
                  createRosterButton(false)
      
   createRosterButton = (active) ->
      window.fannect.mobile.addHeaderButton 
         text: "Roster"
         position: "right"
         # style: if active then "done" else null
         tint: if active then [193, 39, 45, 255] else [120,120,120,255]
         click: () ->
            if overall_active
               leaderboard_vm.selected_view("roster")
               overall_active = false
               forge.topbar.removeButtons () ->
                  createOverallButton(false)
                  createRosterButton(true)
