do ($ = window.jQuery, forge = window.forge, ko = window.ko, fc = window.fannect) ->
   left_header_button = null
   right_header_button = null

   fc.mobile =
      _buttons: {}
      _waiting_to_activate: null
      _header_added: false
      
      _addButton: (index, text, image, target) ->
         forge.tabbar.addButton
            icon: image,
            text: text,
            index: index
         , (button) ->
            name = text.toLowerCase()
            fc.mobile._buttons[name] = button
            
            if fc.mobile._waiting_to_activate == name
               button.setActive()
               fc.mobile._waiting_to_activate = null

            button.onPressed.addListener () ->
               forge.flurry.customEvent("#{text} Menu", show: true)
               $.mobile.changePage target, transition: "none"
         
      createButtons: () -> 
         return if fc.mobile._header_added
         fc.mobile._header_added = true
         forge.tabbar.removeButtons () ->
            fc.mobile._addButton 0, "Profile", "images/mobile/TabBar_Profile.png", "profile.html"
            fc.mobile._addButton 1, "Games", "images/mobile/TabBar_Games.png", "games.html"
            fc.mobile._addButton 2, (if forge.is.android() then "Leaders" else "Leaderboard"), "images/mobile/TabBar_Leaderboard.png", "leaderboard.html"
            fc.mobile._addButton 3, "Connect", "images/mobile/TabBar_Connect.png", "connect.html"
         
      setActiveMenu: (name) ->
         if name
            name = name.toLowerCase()
            forge.tabbar.show()
            
            if fc.mobile._buttons[name] then fc.mobile._buttons[name].setActive()
            else fc.mobile._waiting_to_activate = name

         else
            forge.tabbar.hide () -> $.mobile.activePage.css("min-height", $("body").height())

      setupHeader: () ->
         if forge.is.mobile()
            forge.topbar.removeButtons()
            header = $(".header", $.mobile.activePage).get(0)
            forge.topbar.setTitle $("h1", header).text()

            leftButton = $("a[data-rel=back]", header)

            if leftButton.length > 0
               fc.mobile.addHeaderButton
                  text: leftButton.text()
                  position: "left"
                  style: "back"
                  click: () -> $.mobile.back()

      clearButtons: (position) ->
         leftHeaderButton = null
         rightHeaderButton = null

      addHeaderButton: (options, click) ->
         if forge.is.mobile()
            options.click = click or options.click
            
            leftHeaderButton = options if options.position == "left"
            rightHeaderButton = options if options.position == "right"

            forge.topbar.addButton options, options.click, (err) ->
               if err
                  forge.topbar.removeButtons () ->
                     fc.mobile.addHeaderButton leftHeaderButton if leftHeaderButton
                     fc.mobile.addHeaderButton rightHeaderButton if rightHeaderButton



