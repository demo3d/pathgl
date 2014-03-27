var particles = pathgl.sim.particles(512 * 512).repeat()

d3.select('canvas').selectAll("circle")
.data(particles.unwrap())
.enter().append("circle")
.attr('r', function (d,i) { return d.z })
.attr('cx', function (d,i) { return d.x })
.attr('cy', function (d,i) { return d.y })
.attr('fill', function () { return 'hsl(' + (Math.random() * 240 + 120) + ',100%, 50%)' })

d3.select('canvas').on('mousemove', particles.emit)
d3.select('canvas').on('mousedown', particles.reverse)