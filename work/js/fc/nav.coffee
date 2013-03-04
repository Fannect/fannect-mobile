do ($ = window.jQuery, forge = window.forge, ko = window.ko, fc = window.fannect) ->
   
   class HistoryEntry
      constructor: (path, transition_to, transition_back) ->
         @path = path 
         @height = 0
         @transition_to = transition_to or "slide"
         @transition_back = transition_back or transition_to or "slide"
      go: (transition, reverse) =>
         $changePage @path, {transition: transition or @transition_to, reverse:reverse}
      back: (transition) =>
         # $.mobile.activePage.height(@height) if @height > 0
         $changePage @path, { transition: transition or @transition_back, reverse: true }

   class HistoryPath 
      constructor: (root) -> @history = [new HistoryEntry(root, "none")]
      push: (entry) => 
         curr = @current()
         curr.transition_back = entry.transition_to
         # curr.height = $.mobile.activePage.height()
         @history.push(entry) unless curr.path == entry.path
      current: () => @history[@history.length - 1]
      hasBack: () => @history.length > 1
      empty: () => @history.length = 1
      getBack: () => 
         @history.pop() if @hasBack()
         return @current()

   # Handle navigation
   $changePage = null
   activeHistoryPath = "none"
   historyPaths = 
      none: new HistoryPath("index.html")
      profile: new HistoryPath("profile.html")
      games: new HistoryPath("games.html")
      leaderboard: new HistoryPath("leaderboard.html")
      connect: new HistoryPath("connect.html")

   fc.nav =
      setup: () ->
         # Loop through all of the pages and attach handlers
         for id, page of window.fannect.pages
            $("##{id}")
            .live("pagecreate", pageCreate)
            .live("pageinit", pageInit)
            .live("pagebeforeshow", pageBeforeShow)
            .live("pageshow", pageShow)
            .live("pagebeforehide", pageBeforeHide)
            .live("pagehide", pageHide)
         
         # intercept changePage 
         $changePage = $.mobile.changePage
         $.mobile.back = fc.nav.goBack
         $.mobile.changePage = (toPage, options = {}) ->
            # Add to history if not silent

            if not options.silent and historyPaths[activeHistoryPath] and typeof toPage == "string" and options.role != "popup" and options.transition != "pop"
               entry = new HistoryEntry(toPage, options.transition)
               historyPaths[activeHistoryPath].push(entry)

            $changePage.apply(this, arguments) 
               
      # History Management
      HistoryEntry: HistoryEntry

      hasBack: () -> return historyPaths[activeHistoryPath].hasBack()
      goBack: () ->
         if window.location.href?.indexOf("ui-state=dialog") != -1
            window.location.href = window.location.href.replace("ui-state=dialog", "")
            return historyPaths[activeHistoryPath].current().go("pop")
            
         entry = historyPaths[activeHistoryPath].getBack()
         entry.back() 

      getActiveHistoryName: () -> return activeHistoryPath
      
      # replacePage: (toPage, options = {}) ->
      #    entry = historyPaths[activeHistoryPath].current()
      #    entry.path = toPage
      #    entry.transition_to = options.transition or "none"
      #    entry.go()

      buildHistory: (name, entries, transition) ->
         activeHistoryPath = name
         history = historyPaths[activeHistoryPath]
         history.empty()
         history.push(entry) for entry in entries
         history.current().go(transition or "slidedown")

      backToRoot: (options = {}) ->
         historyPaths[activeHistoryPath].empty()
         entry = historyPaths[activeHistoryPath].current()
         entry.go(options.transition or "none", options.reverse or false)
         
      changeActiveHistoryOrBack: (name, options = {}) ->
         if activeHistoryPath == name
            historyPaths[activeHistoryPath].empty()
            entry = historyPaths[activeHistoryPath].current()
            entry.back(options.transition)
         else
            fc.nav.changeActiveHistory(name, options)

      changeActiveHistory: (name, options = {}) ->
         historyPaths[name].empty() if options.empty
         if activeHistoryPath != name or historyPaths[name].hasBack()
            entry = historyPaths[name].current()
            entry.go(options.transition or "none")
         activeHistoryPath = name

      clearHistory: () -> v.empty() for k, v of historyPaths

      setActiveMenu: (hide) ->
         menu = if hide then "none" else activeHistoryPath 
         if forge.is.web()
            $(".footer .ui-btn-active").removeClass("ui-btn-active").removeClass("ui-btn-persist")
            $(".footer ." + menu + "-menu").addClass("ui-btn-active").addClass("ui-btn-persist")
         else
            fc.mobile.setActiveMenu menu

      closePopup: () ->
         historyPaths[activeHistoryPath].current().go("pop")

      # Utility methods
      getCurrentQueryString: () ->
         fc.parseQueryString($.mobile.activePage.data("url"))

      parseQueryString: (url) ->
         parsed = $.mobile.path.parseUrl(url)
         obj = {}
         qs = parsed.search?.replace("?", "")

         # return empty object if no querystring
         return obj unless qs?

         for section in qs.split("&")
            parts = section.split("=")
            obj[parts[0]] = parts[1]

         return obj
         
   # hold a reference to all viewmodels
   # - required so that memory does not leak as new viewmodels are 
   #   created and old ones still have references
   cachedVMs = {}

   pageCreate = () ->
      if forge.is.mobile()
         # Hide header and footer for mobile
         $(".header", @).removeAttr("data-role data-position data-tap-toggle").css(display: "none")
         $(".footer", @).removeAttr("data-role data-position data-tap-toggle").css(display: "none")

   pageInit = () ->
      $page = $(@)
      id = $page.attr("id")
      page = fc.pages[$page.attr("id")]

      # apply page classes
      if page.classes?
         $page.addClass(c) for c in page.classes

      # get cached vm if any
      vm = cachedVMs[id]

      # create viewmodel if it doesn't exist yet
      if page.vm? and not vm?
         vm = cachedVMs[id] = new page.vm()

      # bind to page
      if vm?
         vm.url = $page.data("url")
         vm.params = fc.nav.parseQueryString(vm.url)
         ko.applyBindings vm, @
         vm.load()

      # create page scrollers
      $(".scrolling-text", $page).scroller() if page.scroller 

   pageBeforeShow = () ->
      $page = $(@)
      id = $page.attr("id")
      page = fc.pages[$page.attr("id")]
      vm = cachedVMs[id]

      # check if logged in and redirect if not
      fc.auth.isLoggedIn() unless id == "index-page"

      # sets the active menu
      fc.nav.setActiveMenu(vm?.params?.hide_menu or false)

      # Add text to native header
      fc.mobile.setHeaderText()

      # scroll to previous position
      # if page.auto_scroll and vm?.prev_scroll_top
      #    $page.height($(window).height() + vm?.prev_scroll_top)
      #    # console.log "SCROLLING TO", vm.prev_scroll_top
      #    $.mobile.silentScroll(vm.prev_scroll_top)


   pageShow = () ->
      $page = $(@)
      id = $page.attr("id")
      page = fc.pages[$page.attr("id")]
      vm = cachedVMs[id]

      # start any scrollers on the page
      $(".scrolling-text", $page).scroller("start") if page.scroller 

      # send flurry event
      forge.flurry.customEvent("#{id} Page", {show: true})

      # add buttons to native header if mobile
      if forge.is.mobile()

         # add back buttons if exist on page
         fc.mobile.setBackButton() unless vm?.params?.hide_back

         # add buttons from configuration
         if page.buttons?.length > 0
            for button in page.buttons
               unless button.click
                  if button.position == "left"
                     button.click = vm.leftButtonClick
                  else 
                     button.click = vm.rightButtonClick
               fc.mobile.addHeaderButton button

      vm.onPageShow() if vm

      # autoshow any tutorials that haven't yet been viewed
      fc.tutorial.autoShow()

      # scroll to previous position
      if page.auto_scroll
         $.mobile.silentScroll(vm.prev_scroll_top) if vm?.prev_scroll_top

   pageBeforeHide = () ->
      $page = $(@)
      id = $page.attr("id")
      page = fc.pages[$page.attr("id")]
      vm = cachedVMs[id]

      # save position of window
      vm.prev_scroll_top = $(window).scrollTop() if vm

      # stop all scrollers
      $(".scrolling-text", $page).scroller("start") if page.scroller 
      
      # remove buttons from header
      fc.mobile.clearButtons() if forge.is.mobile()

   pageHide = () ->
      $page = $(@)
      id = $page.attr("id")
      vm = cachedVMs[id]

      vm.onPageHide() if vm

      # oldMenuRoot = fc.getMenuRoot($page)
      # newMenuRoot = fc.getMenuRoot($.mobile.activePage)
      # menu_context = if oldMenuRoot == newMenuRoot then "same" else "different"

      # remove bindings from page
      ko.cleanNode @
