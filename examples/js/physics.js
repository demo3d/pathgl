var particles = pathgl.sim.particles(1e5)

d3.select('canvas').selectAll("circle")
.data(particles.unwrap())
.enter().append("circle")
.attr('r', function (d) { return d.z })
.attr('cx', function (d) { return d.x })
.attr('cy', function (d) { return d.y })
.shader({'stroke': 'vec4(.2, texel(pos.xy).xz, (16. - r) / 16.)'})

d3.select('canvas').on('click', particles.reverse)
