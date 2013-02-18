do ($ = window.jQuery, forge = window.forge, ko = window.ko, fc = window.fannect, d3 = window.d3) ->
  
   # data = [
   #    val: 'something'
   #    style: 'something'
   # ]

   class fc.Chart
      constructor: (container, options, data) ->
         return unless d3
         @container = container
         @options = options
         @w = @container.width()
         @h = @container.height()

         # console.log "WIDTH", @w

         @use_svg = not fc.isSlow()
         
         if @use_svg
            @chart = d3.select(container.get(0)).append("svg").attr("class", "svg-chart")
            @defs = @chart.append("defs")
            @_createGradient("gradient-passion", "#e13000", "#e01500")
            @_createGradient("gradient-dedication", "#0090ff", "#003cff")
            @_createGradient("gradient-knowledge", "#1cc800", "#008c0a")
         else
            @chart = d3.select(container.get(0)).append("div").attr("class", "html-chart")
         # @_createShadow()


         update(data) if data

      update: (data) =>
         return unless d3
         @data = data
         @x = d3.scale.linear().domain([0, 1]).range([0, @w / @data.length])
         @y = d3.scale.linear().domain(@_getDomain(@data)).rangeRound([0, @h])

         @bar_width = (@w / @data.length) - (10 * (@data.length - 1))

         if @use_svg
            type = "svg"
            @chart.selectAll("rect")
                  .data(@data)
               .enter().append("rect")
                  .attr("x", (d,i) => @x(i) + (10 * i))
                  .attr("y", @h)
                  .attr("width", @bar_width)
                  .attr("height", 0)
                  # .style("fill", (d) -> "url(#gradient-#{d.style})")
                  # .attr("filter", (d) -> "url(#dropshadow)")
                  .attr("class", (d) -> d.style)
               .transition()
                  .delay(150)
                  .duration(750)
                  .ease("quad-out")
                  .attr("y", (d) => @h - @y(d.val) - .5)
                  .attr("height", (d) => @y(d.val))
         else
            type = "html"
            @chart.selectAll("div")
                  .data(@data)
               .enter().append("div")
                  .attr("class", (d) -> "bar " + d.style)
                  .attr("style", (d,i) => 
                     left = "left:" + (@x(i) + (10 * i)) + "px;"
                     width = "width:" + @bar_width + "px;" 
                     height = "height:" + @y(d.val) + "px;"
                     return left + width + height
                  )

         updateTextFn = @_updateText[type][@options.text] or @_updateText[type]["value"]
         updateTextFn.call(@)
        
      _updateText:
         svg:
            value: () ->
               @chart.selectAll("text")
                  .data(@data)
               .enter().append("text")
                  .attr("x", (d,i) => @x(i) + (10 * i))
                  .attr("y", (d,i) => @h)
                  .attr("dx", @bar_width / 2)
                  .attr("dy", "-.4em")
                  .attr("text-anchor", "middle")
                  .text(0)
               .transition()
                  .delay(100)
                  .duration(750)
                  .ease("quad-out")
                  .attr("y", (d, i) => @h - @y(d.val) - .5)
                  .tween("text", (d) ->
                     i = d3.interpolate(this.textContent, d.val)
                     return (t) -> this.textContent = parseInt(i(t)))

            percent: () ->
               sum = 0
               sum += d.val for d in @data 

               @chart.selectAll("text")
                     .data(@data)
                  .enter().append("text")
                     .attr("x", (d,i) => @x(i) + (10 * i))
                     .attr("y", (d,i) => @h)
                     .attr("dx", @bar_width / 2)
                     .attr("dy", "-.4em")
                     .attr("text-anchor", "middle")
                     .text(0)
                  .transition()
                     .delay(100)
                     .duration(750)
                     .ease("quad-out")
                     .attr("y", (d, i) => @h - @y(d.val) - .5)
                     .tween("text", (d) ->
                        value = if sum > 0 then d.val / sum else 0
                        i = d3.interpolate(this.textContent, value)
                        return (t) -> this.textContent = (Math.round(i(t) * 1000) / 10) + "%")
         html: 
            value: () ->
            percent: () ->


      _getDomain: () =>
         max = 0
         (max = d.val if d.val > max) for d in @data

         if max > 20
            return [-1.5, max * 1.20]
         else
            return [-1, 20]

      # _createShadow: () =>
      #    shadow = @chart.append("defs").append("filter")
      #       .attr("id","dropshadow")
      #       .attr("height","130%");

      #    shadow.append("feGaussianBlur")
      #       .attr("in","SourceAlpha")
      #       .attr("stdDeviation","3");

      #    shadow.append("feOffset")
      #       .attr("dx","2")
      #       .attr("dy","2")
      #       .attr("result","offsetblur");

      _createGradient: (id, start, stop) =>
         gradient = @defs.append("svg:linearGradient")
            .attr("id", id)
            .attr("x1", "0%")
            .attr("y1", "0%")
            .attr("x2", "0%")
            .attr("y2", "100%")
            .attr("spreadMethod", "pad");
          
         gradient.append("svg:stop")
            .attr("offset", "0%")
            .attr("stop-color", start)
            .attr("stop-opacity", 1);
          
         gradient.append("svg:stop")
            .attr("offset", "100%")
            .attr("stop-color", stop)
            .attr("stop-opacity", 1);

