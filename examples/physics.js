var canvas = d3.select('canvas').call(pathgl)

var physics = pathgl.sim.force()
physics.update()
// physics.repeat()

// canvas
// .selectAll(".nil")
// .data(d3.range(1000))
// .enter().append("circle")
// .attr('r', 10)
// .attr('fill', physics)
// .attr('cx', function (d, i) { return Math.random() * 900 })
// .attr('cy', function (d, i) { return Math.random() * 600 })

// function readback(physics) {
//   gl = physics.gl

//   var fb = gl.createFramebuffer();
//   gl.bindFramebuffer(gl.FRAMEBUFFER, fb)
//   gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, physics.data, 0)
//   if (gl.checkFramebufferStatus(gl.FRAMEBUFFER) == gl.FRAMEBUFFER_COMPLETE) {
//     var pixels = new Uint8Array(10 *10 * 4)
//     gl.readPixels(0, 0,10,10, gl.RGBA, gl.UNSIGNED_BYTE, pixels)
//   }
//   return pixels
// }

// function debug () {
//   var canvas = d3.select('canvas').call(pathgl)

//   var physics = pathgl.texture()

//   d3.select(physics)
//   .selectAll('circle')
//   .data(d3.range(85))
//   .enter()
//   .append('circle')
//   .attr('r', 200)
//   .attr('cx', function (d) { return 50 + 200 * (d % 5) })
//   .attr('cy', function (d) { return 50 + 200 * ~~(d / 5) })
//   .attr('fill', function () { return 'hsl('+ Math.random() * 360 + ',100%, 50%)' })

//   physics.repeat()

//   canvas
//   .selectAll(".nil")
//   .data(d3.range(1000))
//   .enter().append("circle")
//   .attr('fill', physics)
//   .attr('cx', function (d, i) { return Math.random() * 900 })
//   .attr('cy', function (d, i) { return Math.random() * 600 })
//   .attr('r', 10)
// }