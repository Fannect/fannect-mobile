do ($ = window.jQuery, forge = window.forge, ko = window.ko, fc = window.fannect) ->
   leftHeaderButton = null
   rightHeaderButton = null
   removingButtons = false

   waitingForClear = []

   fc.mobile =
      _buttons: {}
      _waiting_to_activate: null
      _header_added: false
      
      _addButton: (index, text, image, historyPath) ->
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
               fc.nav.changeActiveHistoryOrBack(historyPath)   

      createButtons: () -> 
         return if fc.mobile._header_added
         fc.mobile._header_added = true
         forge.tabbar.removeButtons () ->
            forge.logging.critical("CREATE BUTTONS --------------------------")
            fc.mobile._addButton 0, "Profile", "images/mobile/TabBar_Profile.png", "profile"
            fc.mobile._addButton 1, "Games", "images/mobile/TabBar_Games.png", "games"
            fc.mobile._addButton 2, (if forge.is.android() then "Leaders" else "Leaderboard"), "images/mobile/TabBar_Leaderboard.png", "leaderboard"
            fc.mobile._addButton 3, "Connect", "images/mobile/TabBar_Connect.png", "connect"
            forge.tabbar.show()

      clearBottomButtons: () ->
         fc.mobile._buttons = {}
         
      setActiveMenu: (name) ->
         if name and name != "none"
            name = name.toLowerCase()
            forge.tabbar.show()
            if fc.mobile._buttons[name] then fc.mobile._buttons[name].setActive()
            else fc.mobile._waiting_to_activate = name

         else
            forge.tabbar.hide () -> $.mobile.activePage?.css("min-height", $("body").height())

      setHeaderText: () ->
         if forge.is.mobile()
            forge.topbar.setTitle(fc.getHeaderText($.mobile.activePage))
            fc.mobile.clearButtons()

      setBackButton: () ->
         if forge.is.mobile()
            leftButton = $(".header a[data-rel=back]", $.mobile.activePage)

            if leftButton.length > 0
               fc.mobile.addHeaderButton
                  text: leftButton.text()
                  position: "left"
                  style: "back"
                  click: () -> fc.mobile.clearButtons -> fc.nav.goBack()
                     
      clearButtons: (done) ->
         leftHeaderButton = null
         rightHeaderButton = null

         waitingForClear.push(done) if done
         return if removingButtons
         
         removingButtons = true
         forge.topbar.removeButtons () ->
            fn() for fn in waitingForClear   
            waitingForClear.length = 0
            removingButtons = false
            fc.mobile.addHeaderButton leftHeaderButton if leftHeaderButton
            fc.mobile.addHeaderButton rightHeaderButton if rightHeaderButton
         , (err) ->
            if err
               fn() for fn in waitingForClear   
               waitingForClear.length = 0
               fc.mobile.clearButtons()

      addHeaderButton: (options, click) ->
         if forge.is.mobile()
            options.click = click or options.click
            
            leftHeaderButton = options if options.position == "left"
            rightHeaderButton = options if options.position == "right"

            return if removingButtons

            forge.topbar.addButton options, options.click, (err) ->
               if err
                  setTimeout ->
                     forge.topbar.removeButtons () ->
                        if leftHeaderButton and not leftHeaderButton.second_try
                           leftHeaderButton.second_try = true
                           fc.mobile.addHeaderButton leftHeaderButton 
                        if rightHeaderButton and not rightHeaderButton.second_try
                           fc.mobile.addHeaderButton rightHeaderButton
                           rightHeaderButton.second_try = true
                  , 15


