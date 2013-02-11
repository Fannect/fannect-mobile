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
         @chart = d3.select(container.get(0)).append("svg").attr("class", "chart")
         @w = @container.width()
         @h = @container.height()

         update(data) if data

      update: (data) =>
         return unless d3
         @data = data
         @x = d3.scale.linear().domain([0, 1]).range([0, @w / @data.length])
         @y = d3.scale.linear().domain(@_getDomain(@data)).rangeRound([0, @h])

         @bar_width = (@w / @data.length) - (10 * (@data.length - 1))

         @chart.selectAll("rect")
               .data(@data)
            .enter().append("rect")
               .attr("x", (d,i) => @x(i) + (10 * i))
               .attr("y", @h)
               .attr("width", @bar_width)
               .attr("height", 0)
               .attr("class", (d) -> d.style)
            .transition()
               .delay(100)
               .duration(750)
               .ease("quad-out")
               .attr("y", (d) => @h - @y(d.val) - .5)
               .attr("height", (d) => @y(d.val))

         updateTextFn = @_updateText[@options.text] or @_updateText["value"]
         updateTextFn.call(@)
        
      _updateText:
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
                     return (t) -> this.textContent = parseInt(i(t) * 100) + "%")

      _getDomain: () =>
         max = 0
         (max = d.val if d.val > max) for d in @data

         if max > 0
            return [-1.5, max * 1.20]
         else
            return [-1.5, 20]

