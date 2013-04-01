do ($ = window.jQuery, forge = window.forge, ko = window.ko, fc = window.fannect) ->
   
   class HistoryEntry
      constructor: (path, transition_to, transition_back) ->
         @path = path 
         @height = 0
         @transition_to = transition_to or "slide"
         @transition_back = transition_back or transition_to or "slide"
      go: (options = {}) =>
         options = transition: options if typeof options == "string"
         options.reverse = arguments[1] if arguments.length == 2
         options.transition = options.transition or @transition_to
         pageChanging()
         $changePage @path, options
      back: (options = {}) =>
         options = transition: options if typeof options == "string"
         options.transition = options.transition or @transition_back
         options.reverse = true
         pageChanging()
         $changePage @path, options

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

   cachedParams = {}

   # manages when to remove the timeout for the button handler
   removingButtonsTimeoutId = null
   pageChanging = () ->
      if removingButtonsTimeoutId
         clearTimeout(removingButtonsTimeoutId)
         removingButtonsTimeoutId = null
   
   fc.nav =
      setup: () ->
         # Loop through all of the pages and attach handlers
         for id, page of window.fannect.pages
            $(document)
            .on("pagecreate", "##{id}", pageCreate)
            .on("pageinit", "##{id}", pageInit)
            .on("pagebeforeshow", "##{id}", pageBeforeShow)
            .on("pageshow", "##{id}", pageShow)
            .on("pagebeforehide", "##{id}", pageBeforeHide)
            .on("pagehide", "##{id}", pageHide)
         
         # intercept changePage 
         $changePage = $.mobile.changePage
         $.mobile.back = fc.nav.goBack
         $.mobile.changePage = (toPage, options = {}) ->
            
            # Add to history if not silent
            if not options.silent and historyPaths[activeHistoryPath] and typeof toPage == "string" and options.role != "popup" and options.transition != "pop"
               entry = new HistoryEntry(toPage, options.transition)
               historyPaths[activeHistoryPath]?.push(entry)
               fc.nav.pushCachedParams(toPage, options.params) if options?.params
               pageChanging()

            $changePage.apply(this, arguments) 
               
      # History Management
      HistoryEntry: HistoryEntry

      hasBack: () -> return historyPaths[activeHistoryPath].hasBack()
      goBack: (transition, params) ->
         if window.location.href?.indexOf("ui-state=dialog") != -1
            window.location.href = window.location.href.replace("ui-state=dialog", "")
            return historyPaths[activeHistoryPath].current().go(transition: "pop")
            
         entry = historyPaths[activeHistoryPath].getBack()
         fc.nav.pushCachedParams(entry.path, params)
         entry.back(transition: transition) 

      getActiveHistoryName: () -> return activeHistoryPath
      
      # replacePage: (toPage, options = {}) ->
      #    entry = historyPaths[activeHistoryPath].current()
      #    entry.path = toPage
      #    entry.transition_to = options.transition or "none"
      #    entry.go()

      getRootPaths: () ->
         return (history.history[0].path for key, history of historyPaths)
            
      getActivePath: () ->
         return historyPaths[activeHistoryPath].current().path

      buildHistory: (name, entries, transition) ->
         activeHistoryPath = name
         history = historyPaths[activeHistoryPath]
         history.empty()
         history.push(entry) for entry in entries
         history.current().go(transition: transition or "slidedown")

      backToRoot: (options = {}) ->
         historyPaths[activeHistoryPath].empty()
         entry = historyPaths[activeHistoryPath].current()
         options.transition = options.transition or "none"
         options.silent = true
         entry.go(options)
         
      changeActiveHistoryOrBack: (name, options = {}) ->
         if activeHistoryPath == name
            historyPaths[activeHistoryPath].empty()
            entry = historyPaths[activeHistoryPath].current()
            options.silent == true
            entry.back(options)
         else
            fc.nav.changeActiveHistory(name, options)

      changeActiveHistory: (name, options = {}) ->
         prev = activeHistoryPath
         activeHistoryPath = name
         historyPaths[name].empty() if options.empty
         if activeHistoryPath != prev or historyPaths[activeHistoryPath]?.hasBack()
            entry = historyPaths[name].current()
            options.transition = options.transition or "none"
            options.silent = true
            entry.go(options)

      clearHistory: () -> v.empty() for k, v of historyPaths

      setActiveMenu: (hide) ->
         menu = if hide then "none" else activeHistoryPath 
         if forge.is.web()
            $(".footer .ui-btn-active").removeClass("ui-btn-active").removeClass("ui-btn-persist")
            $(".footer ." + menu + "-menu").addClass("ui-btn-active").addClass("ui-btn-persist")
         else
            fc.mobile.setActiveMenu(menu)

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

      parseRelativePath: (url) ->
         parsed = $.mobile.path.parseUrl(url)
         url = parsed.pathname+parsed.search
         url = url.substring(1) if url[0] == "/"

         # Parse url for mobile
         if forge.is.mobile() and (i = url.indexOf("src/")) != -1
            url = url.substring(i + 4) 

         return url

      getVM: (id) -> cachedVMs[id]

      pushCachedParams: (url, params) ->
         # console.log "PUSH URL: #{url} ----------------------------"
         cachedParams[fc.nav.parseRelativePath(url)] = params
         
      popCachedParams: (url, extend = {}) ->
         url = fc.nav.parseRelativePath(url)

         # console.log "POP URL: #{url} ----------------------------"
         params = cachedParams[url]

         return unless params
         extend[k] = v for k, v of params
         delete cachedParams[url]
         return extend

      peekCachedParams: (url) ->
         return cachedParams[url]
      
   # hold a reference to all viewmodels
   # - required so that memory does not leak as new viewmodels are 
   #   created and old ones still have references
   cachedVMs = {}

   pageCreate = () ->
      if forge.is.mobile()
         # Hide header and footer for mobile
         $(".header", @).removeAttr("data-role data-position data-tap-toggle").css(display: "none")
         $(".footer", @).remove()

   pageInit = () ->
      $page = $(@)
      id = $page.attr("id")
      page = fc.pages[$page.attr("id")] or {}   

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
         fc.nav.popCachedParams(vm.url, vm.params)
         fc.logger.log("before load: #{id}")
         vm.load()
         fc.logger.log("before apply: #{id}")
         ko.applyBindings vm, @
         
      # create page scrollers
      $(".scrolling-text", $page).scroller() if page.scroller 

   pageBeforeShow = () ->
      $page = $(@)
      id = $page.attr("id")
      page = fc.pages[$page.attr("id")]
      vm = cachedVMs[id]

      fc.logger.log("pageBeforeShow: #{id}")

      # check if logged in and redirect if not
      fc.auth.isLoggedIn() unless id == "index-page"

      # sets the active menu
      fc.nav.setActiveMenu(vm?.params?.hide_menu or false)

      # Add text to native header
      fc.mobile.setHeaderText()

      # make sure height is at least height of the window
      if forge.is.mobile()
         $page.css("min-height", $(window).height())

   pageShow = () ->
      $page = $(@)
      id = $page.attr("id")
      page = fc.pages[$page.attr("id")]
      vm = cachedVMs[id]

      # start any scrollers on the page
      $(".scrolling-text", $page).scroller("start") if page.scroller 
      $page.css({position: "relative"})

      # send flurry event
      fc.logger.flurry("#{id} Page")

      # add buttons to native header if mobile
      if forge.is.mobile() and id == $.mobile.activePage.attr("id")

         # add back buttons if exist on page
         hasBack = fc.mobile.setBackButton() unless vm?.params?.hide_back

         # add buttons from configuration
         if page.buttons?.length > 0
            for button in page.buttons
               unless button.click
                  if button.position == "left"
                     button.click = vm.leftButtonClick
                  else 
                     button.click = vm.rightButtonClick
               fc.mobile.addHeaderButton button
         else if not hasBack and not page.custom_buttons
            # This is to solve the issue of quickly changing the page and buttons
            # not being removed. This is not a problem if the new page has header
            # buttons because of the auto retry after failure, but without header
            # buttons there is no retrying
            fc.mobile.clearButtons()
            setTimeout fc.mobile.removeButtons, 50
            # removingButtonsTimeoutId = setTimeout fc.mobile.removeButtons, 100

      vm.onPageShow() if vm

      # autoshow any tutorials that haven't yet been viewed
      fc.tutorial.autoShow()

      # scroll to previous position
      if page.auto_scroll and vm
         $.mobile.silentScroll(vm.prev_scroll_top) if vm?.prev_scroll_top
      else
         # Force window to be at the very top
         window.scrollTo(0)


   pageBeforeHide = () ->
      $page = $(@)
      id = $page.attr("id")
      page = fc.pages[$page.attr("id")]
      vm = cachedVMs[id]

      # save position of window
      vm.prev_scroll_top = $(window).scrollTop() if vm

      # Force window to be at the very top
      window.scrollTo(0)

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
