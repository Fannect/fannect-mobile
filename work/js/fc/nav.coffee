do ($ = window.jQuery, forge = window.forge, ko = window.ko, fc = window.fannect) ->
   
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
         
         # so coffeescript doesn't return the collected loop
         return true 

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
         ko.applyBindings vm, @
         vm.url = $page.data("url")
         vm.params = fc.nav.parseQueryString(vm.url)
         vm.load()
         
      # create page scrollers
      $(".scrolling-text", $page).scroller() if page.scroller 

   pageBeforeShow = () ->
      $page = $(@)
      id = $page.attr("id")
      vm = cachedVMs[id]

      # check if logged in and redirect if not
      fc.auth.isLoggedIn() unless id == "index-page"

      # sets the active menu
      fc.setActiveMenu fc.getMenuRoot @

      # Add text to native header
      fc.mobile.setHeaderText()

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
         fc.mobile.setBackButton()

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
