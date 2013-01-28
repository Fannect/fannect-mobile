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

         update(data) if data

      update: (data) =>
         @data = data
         @x = d3.scale.linear().domain([0, 1]).range([0, @w / @data.length])
         @y = d3.scale.linear().domain(@getDomain(@data)).rangeRound([0, @h])

         @chart.selectAll("rect")
               .data(@data, (d) -> d.val)
            .enter().append("rect")
               .attr("x", (d,i) => @x(i) + (10 * i))
               .attr("y", @h)
               .attr("width", (@w / @data.length) - (10 * (@data.length - 1)))
               .attr("height", 0)
               .attr("class", (d) -> d.style)
            .transition()
               .delay(100)
               .duration(750)
               .ease("quad-out")
               .attr("y", (d) => @h - @y(d.val) - .5)
               .attr("height", (d) => @y(d.val))
               
      getDomain: (data) ->
         max = 0
         (max = d.val if d.val > max) for d in data
         return [0, max * 1.1]

