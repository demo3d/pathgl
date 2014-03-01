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
  gl.bufferData(gl.ARRAY_BUFFER, 4 * bSize, gl.DYNAMIC_DRAW)
  return b
}

function drawPoints(elapsed) {
  if( !p1) initBuffersp()

  var pointBuffer = canvas.pb
  var pointPosBuffer = canvas.ppb

  if (! pointCount) return
  if (pointsChanged) {
    gl.bindBuffer(gl.ARRAY_BUFFER, p1)
    gl.bufferSubData(gl.ARRAY_BUFFER, 0, pointPosBuffer)
    gl.vertexAttribPointer(program.pos, 4, gl.FLOAT, false, 0, 0)
    gl.enableVertexAttribArray(program.pos)

    gl.bindBuffer(gl.ARRAY_BUFFER, p2)
    gl.bufferSubData(gl.ARRAY_BUFFER, 0, colorBuffer)
    gl.vertexAttribPointer(program.fill, 1, gl.FLOAT, false, 0, 0)
    gl.enableVertexAttribArray(program.fill)

    gl.bindBuffer(gl.ARRAY_BUFFER, p3)
    gl.bufferSubData(gl.ARRAY_BUFFER, 0, colorBuffer)
    gl.vertexAttribPointer(program.stroke, 1, gl.FLOAT, false, 0, 0)
    gl.enableVertexAttribArray(program.stroke)

    gl.bindBuffer(gl.ARRAY_BUFFER, p4)
    gl.bufferSubData(gl.ARRAY_BUFFER, 0, fBuffer)
    gl.vertexAttribPointer(program.fugue, 4, gl.FLOAT, false, 0, 0)
    gl.enableVertexAttribArray(program.fugue)

    pointsChanged = false
  }
  gl.drawArrays(gl.POINTS, 0, pointCount)
}
