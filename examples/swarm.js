var canvas = d3.select('canvas').call(pathgl)

var physics = pathgl.texture()

d3.select(physics)
.selectAll('circle')
.data(d3.range(800))
.enter()
.append('circle')
.attr('r', 100)
.attr('cx', function (d) { return 30 * (d % 35)})
.attr('cy', function (d) { return 30 * ~~(d / 35)})
.attr('fill', function () { return "hsl(" + Math.random() * 360 + ",100%, 50%)" })

physics.repeat()

canvas
.selectAll(".nil")
.data(d3.range(1000))
.enter().append("circle")
.attr('fill', physics)
.attr('cx', function (d, i) { return Math.random() * 900 })
.attr('cy', function (d, i) { return Math.random() * 600 })
.attr('r', function (d, i) { return 50 })
