var particles = pathgl.sim.particles(1e5)

d3.select('canvas').selectAll("circle")
.data(particles.unwrap())
.enter().append("circle")
.attr('r', function (d,i) { return d.z })
.attr('cx', function (d,i) { return d.x })
.attr('cy', function (d,i) { return d.y })
.attr('fill', function () { return 'hsl(' + (Math.random() * 240 + 120) + ',100%, 50%)' })
.shader({'stroke': 'unpack_color(stroke) + vec4(texture2D(texture, abs(pos.xy)).x, .5, texture2D(texture, abs(pos.xy)).w, .1)'})

d3.select('canvas').on('click', particles.reverse)
