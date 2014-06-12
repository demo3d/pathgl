var particles = pathgl.sim.particles(1e5)

d3.select('canvas').selectAll("circle")
.data(particles.unwrap())
.enter().append("circle")
.attr('r', function (d) { return d.z })
.attr('cx', function (d) { return d.x })
.attr('cy', function (d) { return d.y })
.shader({'stroke': 'vec4(tex(pos.xy).x, .2, tex(pos.xy).z' +  ', (10. - r) / 5.0)'})

d3.select('canvas').on('click', function () {
    pathgl.uniform('gravity', pathgl.uniform('gravity') * -1)
})
