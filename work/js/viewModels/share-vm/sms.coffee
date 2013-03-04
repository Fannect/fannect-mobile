do ($ = jQuery, ko = window.ko, fc = window.fannect) ->
   
   sms_text = ""

   class fc.viewModels.Share.SMS extends fc.viewModels.Base 
      constructor: () ->
         super
         @selected_contacts = ko.observable()
         @contacts = ko.observableArray()
         # @contacts([{id: "1", displayName: "Blake VanLan"}, {id: "2", displayName: "Blake VanLandingham"}, {id: "2", displayName: "Bla VanLandingham"}])

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
            return cb([]) if contact.phoneNumbers.length == 0 

            # results = []

            # for phone in contact.phoneNumbers
               # {
               #    "value": "+447554639203",
               #    "type": "work",
               #    "pref": false
               #  }

               # results.push {
               #    displayName: "#{contact.displayName} (#{phone.type})"
               #    phoneNumber: phone.value
               # }

               # cb(results)
            cb([contact])

         , (err) ->
            cb([])

      rightButtonClick: () =>
         console.log "SELECTED: #{JSON.stringify(@selected_contacts())}"
         return 

         for contact in @selected_contacts()
            contact.phoneNumbers


      onPageShow: () =>
         super
         fc.mobile.addHeaderButton {
            position: "right"
            style: "done"
            text: "Send"
            click: @rightButtonClick
         }