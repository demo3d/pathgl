var canvas = d3.select('canvas').call(pathgl)
var n = Math.pow(512, 2)
var physics = pathgl.sim.force(n)

physics.repeat()

canvas
.selectAll("circle")
.data(d3.range(n))
.enter()
.append("circle")
.attr('fill', function () { return 'hsl(' + Math.random() * 360 + ',100%, 50%)' })
.attr('cx', physics.x())
.attr('cy', physics.y())
.attr('r', 5)
