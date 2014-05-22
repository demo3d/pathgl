var particles = pathgl.sim.particles(1e5)

d3.select('canvas').selectAll("circle")
.data(particles.unwrap())
.enter().append("circle")
.attr('r', 4)
.attr('cx', function (d,i) { return d.x })
.attr('cy', function (d,i) { return d.y })
.shader({'stroke': 'texel(pos.xy).xzwy'})

d3.select('canvas').on('click', particles.reverse)
