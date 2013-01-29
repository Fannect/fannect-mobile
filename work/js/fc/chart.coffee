do ($ = window.jQuery, forge = window.forge, ko = window.ko, fc = window.fannect, d3 = window.d3) ->
  
   # data = [
   #    val: 'something'
   #    style: 'something'
   # ]

   class fc.Chart
      constructor: (container, data) ->
         # console.log
         return unless d3
         @container = container
         @chart = d3.select(container.get(0)).append("svg").attr("class", "chart")
         @w = @container.width()
         @h = @container.height()

         update(data) if data

      update: (data) =>
         return unless d3
         @data = data
         @x = d3.scale.linear().domain([0, 1]).range([0, @w / @data.length])
         @y = d3.scale.linear().domain(@getDomain(@data)).rangeRound([0, @h])

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

         @chart.selectAll("text")
               .data(@data)
            .enter().append("text")
               .attr("x", (d,i) => @x(i) + (10 * i))
               .attr("y", (d,i) => @h)
               .attr("dx", @bar_width / 2)
               .attr("dy", "1.3em")
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
               
      getDomain: (data) ->
         max = 0
         (max = d.val if d.val > max) for d in data
         return [0, max * 1.1]

