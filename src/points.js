var p1, p2, p3, p4

function initBuffersp() {
  p1 = makeBuffer()
  p2 = makeBuffer()
  p3 = makeBuffer()
  p4 = makeBuffer()
}

function makeBuffer () {
  var b = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, b)
  gl.bufferData(gl.ARRAY_BUFFER, 5e6, gl.DYNAMIC_DRAW)
  return b
}

function drawPoints(elapsed) {
  pointMesh.draw()
}
