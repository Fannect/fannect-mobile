do ($ = jQuery, ko = window.ko, fc = window.fannect) ->
   
   class fc.viewModels.Share.SMS extends fc.viewModels.Base 
      constructor: () ->
         super
         @selected_contacts = ko.observable()
         @contacts = ko.observableArray()
         @contacts([{id: "1", displayName: "Blake VanLan"}, {id: "2", displayName: "Blake VanLandingham"}, {id: "2", displayName: "Bla VanLandingham"}])
         # @load()

      load: () =>
         forge.contact.selectAll (contacts) =>
            @contacts(contacts)
            # console.log "ARRAY: #{JSON.stringify(@contacts())}"
            # console.log "CONTACT #{JSON.stringify(contact)}"
         , (err) ->
            forge.msg.show("Failed to access contacts!")

      # getContactInfo: () =>
      filterContact: (contact, cb) =>
         forge.contact.selectById contact.id, (contact) =>
            console.log "CONTACT DETAILS: #{JSON.stringify(contact)}"
            if contact.phoneNumbers.length > 0 then cb(contact)
            else cb(false)
         , (err) ->
            cb(false)

      rightButtonClick: () =>
         # forge

      onPageShow: () =>
         super
         fc.mobile.addHeaderButton {
            position: "right"
            style: "done"
            text: "Send"
            click: @rightButtonClick
         }