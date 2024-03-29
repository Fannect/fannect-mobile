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
            $.mobile.activePage?.css("min-height", $("body").height())
            
            if fc.mobile._waiting_to_activate == name
               button.setActive()
               fc.mobile._waiting_to_activate = null

            button.onPressed.addListener () ->
               forge.flurry.customEvent("#{text} Menu", show: true)
               fc.nav.changeActiveHistoryOrBack(historyPath)   

      createButtons: () -> 
         return if fc.mobile._header_added or forge.is.web()
         fc.mobile._header_added = true
         forge.tabbar.removeButtons () ->
            fc.mobile._addButton 0, "Profile", "images/mobile/TabBar_Profile.png", "profile"
            fc.mobile._addButton 1, "Games", "images/mobile/TabBar_Games.png", "games"
            fc.mobile._addButton 2, (if forge.is.android() then "Leaders" else "Leaderboard"), "images/mobile/TabBar_Leaderboard.png", "leaderboard"
            fc.mobile._addButton 3, "Connect", "images/mobile/TabBar_Connect.png", "connect"
            
      clearBottomButtons: () ->
         fc.mobile._buttons = {}
         
      setActiveMenu: (name) ->
         return if forge.is.web()
         if name and name != "none"
            name = name.toLowerCase()
            forge.tabbar.show()
            if fc.mobile._buttons[name] then fc.mobile._buttons[name].setActive()
            else fc.mobile._waiting_to_activate = name
         else
            forge.tabbar.hide () -> $.mobile.activePage?.css("min-height", $(window).height())

      setHeaderText: () ->
         return if forge.is.web()
         forge.topbar.setTitle(fc.getHeaderText($.mobile.activePage))
         fc.mobile.clearButtons()

      setBackButton: () ->
         return if forge.is.web()
         leftButton = $(".header a[data-rel=back]", $.mobile.activePage)

         if leftButton.length > 0
            fc.mobile.addHeaderButton
               text: leftButton.text()
               position: "left"
               style: "back"
               click: () -> fc.mobile.clearButtons -> fc.nav.goBack()
            return true

         return false
                     
      clearButtons: (done) ->
         return if forge.is.web()
         leftHeaderButton = null
         rightHeaderButton = null
         fc.mobile.removeButtons(done)

      removeButtons: (done) ->
         return if forge.is.web()
         waitingForClear.push(done) if done
         return if removingButtons
         
         removingButtons = true
         forge.topbar.removeButtons () ->
            removingButtons = false
            fn() for fn in waitingForClear   
            waitingForClear.length = 0
            fc.mobile.addHeaderButton leftHeaderButton if leftHeaderButton
            fc.mobile.addHeaderButton rightHeaderButton if rightHeaderButton
         , (err) ->
            removingButtons = false
            fc.mobile.removeButtons()

      addHeaderButton: (options, click) ->
         return if forge.is.web()
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


