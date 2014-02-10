var p1, p2, p3, p4

var oncep = once(function initBuffersp() {
  p1 = gl.createBuffer(), p2 = gl.createBuffer(), p3 = gl.createBuffer(), p4 = gl.createBuffer()
})

function drawPoints(elapsed) {
  var pointBuffer = canvas.pb
  var pointPosBuffer = canvas.ppb
  oncep()
  //if (! pointBuffer.count) return
  if (pointsChanged) {
    gl.bindBuffer(gl.ARRAY_BUFFER, p1)
    gl.bufferData(gl.ARRAY_BUFFER, pointPosBuffer, gl.DYNAMIC_DRAW)
    gl.vertexAttribPointer(program.pos, 4, gl.FLOAT, false, 0, 0)
    gl.enableVertexAttribArray(program.pos)

    gl.bindBuffer(gl.ARRAY_BUFFER, p2)
    gl.bufferData(gl.ARRAY_BUFFER, colorBuffer, gl.DYNAMIC_DRAW)
    gl.vertexAttribPointer(program.fill, 1, gl.FLOAT, false, 0, 0)
    gl.enableVertexAttribArray(program.fill)

    gl.bindBuffer(gl.ARRAY_BUFFER, p3)
    gl.bufferData(gl.ARRAY_BUFFER, colorBuffer, gl.DYNAMIC_DRAW)
    gl.vertexAttribPointer(program.stroke, 1, gl.FLOAT, false, 0, 0)
    gl.enableVertexAttribArray(program.stroke)
    pathgl.uniform('type', 1)
    // gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, p4)
    // gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, pointBuffer, gl.DYNAMIC_DRAW)
    pointsChanged = false
  }
  gl.drawArrays(gl.POINTS, 0, 2e5)

  // gl.drawElements(gl.POINTS, pointBuffer.count * 4, gl.UNSIGNED_SHORT, 0)
}
