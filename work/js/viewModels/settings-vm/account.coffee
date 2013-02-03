do ($ = jQuery, ko = window.ko, fc = window.fannect) ->

   class fc.viewModels.Settings.Account extends fc.viewModels.Base 
      constructor: () ->
         @first_name = ko.observable()
         @last_name = ko.observable()
         @email = ko.observable()
         @password = ko.observable()
         @confirm_password = ko.observable()
         @load()
         super

      load: () =>
         fc.msg.loading("Loading user...")
         fc.user.get (err, user) =>
            fc.msg.hide()
            return fc.msg.show("Something went wrong! :O") if err
            @first_name user.first_name
            @last_name user.last_name
            @email user.email

      update: () =>
         fc.msg.loading("Updating accout...")

         count = 0
         hasError = false

         done = () ->
            if hasError
               fc.msg.show("Failed to update account!")
            else if --count <= 0 
               fc.msg.show("Your account has been updated!")

         fc.user.get (err, user) =>

            return fc.msg.show("Something went wrong! :0") if err or not user

            # check to see if password or email has been updated
            if @password() or @email() != user.email
               count++
               
               data = {}
               data.email = @email() if @email() != user.email
               if @password() and @password() != @confirm_password()
                  return fc.msg.show("The passwords don't match! Please try again.")
               else
                  data.password = @password() if @password()

                  fc.ajax
                     url: "#{fc.getLoginURL()}/v1/users/#{user._id}"
                     type: "PUT"
                     data: data
                  , (err, resp) ->
                     if resp?.status == "success"
                        fc.auth._refresh_token = resp.refresh_token
                        fc.user.clearCache()
                     else  
                        hasError = true
                     done()
            
            # check to see if first name or last name has been updated
            if @first_name() != user.first_name or @last_name() != user.last_name
               count++
               data = {}
               data.first_name = @first_name() if @first_name() != user.first_name
               data.last_name = @last_name() if @last_name() != user.last_name

               fc.ajax
                  url: "#{fc.getResourceURL()}/v1/me"
                  type: "PUT"
                  data: data
               , (err, resp) ->
                  if resp?.status == "success" then fc.team.clearCache()
                  else hasError = true
                  done()

            done() if count == 0