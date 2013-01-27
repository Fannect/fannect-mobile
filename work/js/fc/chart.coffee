do ($ = window.jQuery, forge = window.forge, ko = window.ko, fc = window.fannect) ->
   
   # data = [
   #    val: 'something'
   #    style: 'something'
   # ]

   class fc.Chart
      constructor: (container, data) ->
         @container = container
         @chart = d3.select(container.get(0)).append("svg").attr("class", "chart")
         @w = @container.width()
         @h = @container.height()
         @y = d3.scale.linear().domain([0, 90]).rangeRound([0, @h])

         update(data) if data

      update: (data) =>
         @data = data
         @x = d3.scale.linear().domain([0, 1]).range([0, @w / @data.length])
         
         chart.selectAll("rect")
               .data(@data, (d) -> d.val)
            .enter().append("rect")
               .attr("x", (d,i) => @x(i) - .5)
               .attr("y", @h)
               .attr("width", @w / @data.length)
               .attr("height", 0)
               .attr("class", (d) -> d.style)
            .transition()
               .delay(100)
               .duration(750)
               .ease("quad-out")
               .attr("y", (d) => @h - @y(d.val) - .5)
               .attr("height", (d) => @y(d.val))
               


