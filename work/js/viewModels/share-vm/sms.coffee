do ($ = jQuery, ko = window.ko, fc = window.fannect) ->
   
   sms_text = ""

   class fc.viewModels.Share.SMS extends fc.viewModels.Base 
      constructor: () ->
         super
         @selected_contacts = ko.observable()
         @contacts = new fc.AlphaTable({ merge:true })
         # @contacts.loadArray("displayName", [{id: "1", displayName: "Blake VanLan"}, {id: "2", displayName: "Blake VanLandingham"}, {id: "2", displayName: "Bla VanLandingham"}, {id: "2", displayName: "Bla VanLandingham"}, {id: "2", displayName: "Bla VanLandingham"}, {id: "2", displayName: "Bla VanLandingham"}, {id: "2", displayName: "Bla VanLandingham"}, {id: "2", displayName: "Bla VanLandingham"}, {id: "2", displayName: "Bla VanLandingham"}, {id: "2", displayName: "Bla VanLandingham"}, {id: "2", displayName: "Bla VanLandingham"}, {id: "2", displayName: "Bla VanLandingham"}, {id: "2", displayName: "Bla VanLandingham"}, {id: "2", displayName: "Bla VanLandingham"}, {id: "2", displayName: "Bla VanLandingham"}, {id: "2", displayName: "Bla VanLandingham"}, {id: "2", displayName: "Bla VanLandingham"}, {id: "2", displayName: "Bla VanLandingham"}, {id: "2", displayName: "Bla VanLandingham"}, {id: "2", displayName: "Bla VanLandingham"}, {id: "2", displayName: "Bla VanLandingham"}, {id: "2", displayName: "Bla VanLandingham"}, {id: "2", displayName: "Bla VanLandingham"}])

      load: () =>
         forge.contact.selectAll (contacts) =>
            @contacts.loadArray("displayName", contacts)
         , (err) ->
            forge.msg.show("Failed to access contacts!")
         

      # filterContact: (index, contact, cb) =>
      #    return cb(@cachedContacts[contact.id]) if @cachedContacts[contact.id]
      #    forge.contact.selectById contact.id, (contact) =>
      #       return cb([]) if contact.phoneNumbers.length == 0 

      #       results = []

      #       for phone in contact.phoneNumbers
      #          # {
      #          #    "value": "+447554639203",
      #          #    "type": "work",
      #          #    "pref": false
      #          #  }

      #          results.push {
      #             displayName: "#{contact.displayName} (#{phone.type})"
      #             phoneNumber: phone.value
      #          }

      #       @cachedContacts[contact.id] = results
      #       cb(results)

      #    , (err) ->
      #       cb([])

      rightButtonClick: () =>
         fc.msg.loading("Sending...")
         numbers = []
         ids = []
         count = 0

         for contact in @selected_contacts()
            if contact.id instanceof Array
               ids.push(id) for id in contact.id
            else
               ids.push(id)

         forge.logging.critical("IDS: #{JSON.stringify(ids)} -----------------------")
       
         for id in ids
            count++
            forge.contact.selectById id, (contact) =>
               numbers.push(contact.phoneNumbers[0].value) if contact.phoneNumbers?.length > 0

               forge.logging.critical("COUNT: #{count} -----------------------")
               if --count <= 0
                  forge.logging.critical("NUMBERS: #{JSON.stringify(numbers)} -----------------------")
                  forge.sms.send
                     body: "Hello from Fannect!"
                     to: numbers
                  , () -> 
                     fc.msg.hide()
                     setTimeout (() => @selected_contacts([])), 20
                     fc.nav.goBack("flip")
                  , () -> fc.msg.show("Unable to send SMS at this time!")

            , () -> 
               count--
               fc.msg.show("Unable to send SMS at this time!")

      onPageHide: () =>
         # Clear up memory, hopefully
         @contacts.empty()
         delete @cachedContacts[k] for k, v of @cachedContacts

      onPageShow: () =>
         super
         fc.mobile.addHeaderButton {
            position: "right"
            style: "done"
            text: "Send"
            click: @rightButtonClick
         }