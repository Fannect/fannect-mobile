do ($ = window.jQuery, forge = window.forge, ko = window.ko, fc = window.fannect) ->
   
   cachedPages = {}


   fc.nav =
      setup: () ->
         for i, p of window.fannect.pages
            do (id = i, page = p) ->
               vm = null 
               scroller = null
               $page = null
               
               initPage = () ->
                  # apply page classes
                  $page = $(@)
                  if page.classes?
                     $page.addClass(c) for c in page.classes

                  # create viewmodel and bind to page
                  if page.vm?
                     vm = new page.vm()
                     ko.applyBindings vm, @
                  
                  # create page scrollers
                  if page.scroller then scroller = $(".scrolling-text", @).scroller()

               $("##{id}").live("pageinit", initPage
               ).live("pagebeforeshow", () ->
                  fc.mobile.setupHeader()
               ).live("pageshow", () ->
                  initPage.call(@) unless vm
                  if scroller then scroller.scroller("start")
                  forge.flurry.customEvent("#{id} Page", {show: true})
      
                  if forge.is.mobile()
                     # add buttons to native header if mobile
                     fc.mobile.setupBackButton()

                     if page.buttons?.length > 0
                        for button in page.buttons
                           unless button.click
                              if button.position == "left"
                                 button.click = vm.leftButtonClick
                              else 
                                 button.click = vm.rightButtonClick
                           fc.mobile.addHeaderButton button

                  vm.onPageShow() if vm

               ).live("pagebeforehide", () ->
                  console.log $(window).scrollTop()
                  if scroller then scroller.scroller("stop")
                  fc.mobile.clearButtons() if forge.is.mobile()
               ).live("pagehide", () ->
                  vm.onPageHide() if vm
                  if page.no_cache
                     vm = null
                     $page.remove()
               )
         return true

      parseQueryString: () ->
         parsed = $.mobile.parseUrl(window.location.hash)
         return parseQueryStringToObject(parsed.search)

      parseQueryStringToObject: (qs) ->
         obj = {}
         qs = qs.replace("?", "")

         for section in qs.split("&")
            parts = section.split("=")
            obj[parts[0]] = parts[1]

         return obj
         


