var canvas = d3.select('canvas').call(pathgl)

var physics = pathgl.sim.force()

canvas
.selectAll(".nil")
.data(d3.range(1000))
.enter().append("circle")
.attr('fill', 'red')
.attr('cx', function (d, i) { return Math.random() * 900 })
.attr('cy', function (d, i) { return Math.random() * 600 })
.attr('r', function (d, i) { return 50 })
