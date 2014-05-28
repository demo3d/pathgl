var particles = pathgl.sim.particles(1e5)

d3.select('canvas').selectAll("circle")
.data(particles.unwrap())
.enter().append("circle")
.attr('r', 2)
.attr('cx', function (d,i) { return d.x })
.attr('cy', function (d,i) { return d.y })
//.shader({'stroke': 'texel(pos.xy).xzwy'})
//.shader({'stroke': 'texel(pos.xy).yzwx'})
.shader({'stroke': 'vec4(.2, texel(pos.xy).xzy)'})

d3.select('canvas').on('click', particles.reverse)
