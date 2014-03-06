var canvas = d3.select('canvas').call(pathgl)

var physics = pathgl.texture()

d3.select(physics)
.append('circle')
.attr('r', 1000)
.attr('fill', 'blue')

physics.repeat()

canvas
.selectAll("circle")
.data(d3.range(100))
.enter().append("circle")
.attr('fill', physics)
.attr('cx', function (d, i) { return Math.random() * 900 })
.attr('cy', function (d, i) { return Math.random() * 600 })
.attr('r', function (d, i) { return 5 })
