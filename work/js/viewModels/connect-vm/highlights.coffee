do ($ = jQuery, ko = window.ko, fc = window.fannect) ->

   class fc.viewModels.Connect.Highlights extends fc.viewModels.Base 

      constructor: () ->
         super
         @limit = 20
         @skip = 0
         @has_more = ko.observable(true)
         @created_by = ko.observable("spirit_wear")
         @sort_by = ko.observable("most_popular")
         @team_id = null

         @highlights = ko.observableArray()
         @loading_more = ko.observable false
         @sort_by.subscribe () => @reloadHighlights()
         @challenge_title = ko.observable("Loading...")
         @challenge_description = ko.observable("Loading...")
         @challenge_expiration = 0
         @subtitle = ko.computed () =>
            switch @created_by()
               when "spirit_wear" then return "Show off your gear as you rep your team"
               when "gameday_pics" then return "Snap a pic of your Gameday festivities"
               when "picture_with_player" then return "Snag a picture with an athlete"
               when "photo_challenge" then return @challenge_description()
               else return ""

         fc.team.getActive (err, profile) =>
            @team_id = profile.team_id
            # Load immediately
            @loadHighlights()

         # reload results if team profile changes
         fc.team.onActiveChanged (profile) =>
            @previous_scroll_top = 0
            @team_id = profile.team_id
            @reloadHighlights()

         @loadPhotoChallenge()

      reloadHighlights: () =>
         @highlights.removeAll()
         @skip = 0
         @has_more(true)
         @loadHighlights()
      
      loadHighlights: () =>
         sort_by = @sort_by()
         created_by = @created_by()
         @loading_more(true)
         fc.ajax 
            url: "#{fc.getResourceURL()}/v1/teams/#{@team_id}/highlights?limit=#{@limit}&skip=#{@skip}&sort_by=#{sort_by}&created_by=#{created_by}"
            type: "GET"
         , (err, highlights) =>
            @loading_more(false)
            return unless (sort_by == @sort_by() and created_by == @created_by())
            if err
               @has_more(false)
               return fc.msg.show("Failed to load highlights..")
           
            @skip += @limit
            @has_more(highlights.length == @limit)
            @highlights.push(@prepHighlight(highlight)) for highlight in highlights

      load: () =>
         if @params.created_by
            @created_by(@params.created_by)
            @reloadHighlights()
            
      sortByOldest: () => @sort_by("oldest")
      sortByMostPopular: () => @sort_by("most_popular")
      sortByNewest: () => @sort_by("newest")

      # HANDLING SLIDER
      sliderOptions: () =>
         switch @created_by()
            when "spirit_wear" then start = 0
            when "photo_challenge" then start = 1
            when "gameday_pics" then start = 2
            when "picture_with_a_player" then start = 3
            when "any" then start = 4
            else start = 0 
            
         return { 
            hide: @sliderHide 
            show: @sliderShow 
            count: 5
            start: start
         }
         
      sliderHide: (index) =>

      sliderShow: (index) =>
         if index == 0 and @created_by() != "spirit_wear"
            @created_by("spirit_wear")
            @reloadHighlights()
         else if index == 1 and @created_by() != "photo_challenge"
            @created_by("photo_challenge")
            @reloadHighlights()
            @loadPhotoChallenge()
         else if index == 2 and @created_by() != "gameday_pics"
            @created_by("gameday_pics")
            @reloadHighlights()
         else if index == 3 and @created_by() != "picture_with_a_player"
            @created_by("picture_with_a_player")
            @reloadHighlights()
         else if index == 4 and @created_by() != "any"
            @created_by("any")
            @reloadHighlights()

      onPageShow: () =>
         $window = $(window).bind "scroll.highlightspage", () =>
            if not @loading_more() and @has_more() and $window.scrollTop() > $(document).height() - $window.height() - 150
               @loadHighlights()
         
      onPageHide: () => $(window).unbind("scroll.highlightspage")
   
      highlightComments: (highlight) =>
         $.mobile.changePage "connect-highlights-comments.html", 
            params: { highlight: highlight }
            transition: "slide"

      highlightShare: (highlight) =>
         $.mobile.changePage "connect-highlights-share.html", 
            params: { highlight: highlight }
            transition: "slide"

      upVote: (highlight) =>
         return if highlight.current_vote() == "owner"

         if highlight.current_vote() == "up"
            highlight.up_votes(highlight.up_votes() - 1)
            highlight.current_vote("none")
            @sendVote(highlight._id, "none")
         else
            highlight.up_votes(highlight.up_votes() + 1)
            highlight.down_votes(highlight.down_votes() - 1) if highlight.current_vote() == "down"
            highlight.current_vote("up")
            @sendVote(highlight._id, "up")

      downVote: (highlight) =>
         return if highlight.current_vote() == "owner"

         if highlight.current_vote() == "down"
            highlight.down_votes(highlight.down_votes() - 1)
            highlight.current_vote("none")
            @sendVote(highlight._id, "none")
         else
            highlight.down_votes(highlight.down_votes() + 1)
            highlight.up_votes(highlight.up_votes() - 1) if highlight.current_vote() == "up"
            highlight.current_vote("down")
            @sendVote(highlight._id, "down")

      sendVote: (id, vote) =>
         fc.ajax
            url: "#{fc.getResourceURL()}/v1/highlights/#{id}/vote"
            type: "POST"
            data: { vote: vote }

      loadPhotoChallenge: () =>
         now = new Date() / 1
         if @challenge_expiration <= now
            # refresh challenge
            @challenge_expiration = now + 60000
            fc.team.getActive (err, profile) =>
               fc.ajax
                  url: "#{fc.getResourceURL()}/v1/me/teams/#{profile._id}/games/photo_challenge"
                  type: "GET"
               , (err, result) =>
                  if err or results?.status == "fail"
                     @challenge_title("Unknown")
                     @challenge_description("Failed to load this weeks challenge")
                  else
                     @challenge_title(result.meta.challenge_title)
                     @challenge_description(result.meta.challenge_description)

      prepHighlight: (highlight) =>
         now = new Date()
         date = fc.parseId(highlight._id)
         time = dateFormat(date, "h:MM TT")
         if (
            date.getMonth() == now.getMonth() and
            date.getFullYear() == now.getFullYear()
         )
            if date.getDate() == now.getDate()
               highlight.date_text = "Today at #{time}"
            else if date.getDate() == now.getDate() - 1
               highlight.date_text = "Yesterday at #{time}"
            else
               highlight.date_text = "#{dateFormat(date, "mm/dd/yyyy")} at #{time}"
         else
            highlight.date_text = "#{dateFormat(date, "mm/dd/yyyy")} at #{time}"

         # comments
         switch highlight.comment_count
            when 0 then highlight.comment_text = "No Comments"
            when 1 then highlight.comment_text = "1 Comment"
            else highlight.comment_text = "#{highlight.comment_count} Comments"
         
         # voting
         highlight.show_voting = (@created_by() != "any")
         highlight.current_vote = ko.observable(highlight.current_vote or "none")
         highlight.down_votes = ko.observable(highlight.down_votes or 0)
         highlight.up_votes = ko.observable(highlight.up_votes or 0)
         
         highlight.up_vote_percent = ko.computed () -> 
            return 50 if (total = highlight.down_votes() + highlight.up_votes()) == 0 or isNaN(total)
            return highlight.up_votes() / total * 100
         highlight.down_vote_percent = ko.computed () -> 
            return 50 if (total = highlight.down_votes() + highlight.up_votes()) == 0 or isNaN(total)
            return highlight.down_votes() / total * 100

         return highlight
         