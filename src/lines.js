var lineBuffer = new Uint16Array(4e4)
var linePosBuffer = new Float32Array(4e4)

lb = lineBuffer
lpb = linePosBuffer

function initBuffers () {
  b1 = gl.createBuffer(), b2 = gl.createBuffer(), b3 = gl.createBuffer(), b4 = gl.createBuffer()
}

var once = once(initBuffers)
function once (fn) {
  return function () { fn && (fn(), fn = null) }
}
function drawLines(){
  once()
  return

  gl.bindBuffer(gl.ARRAY_BUFFER, b1)
  gl.enableVertexAttribArray(program.vPos)
  gl.bufferData(gl.ARRAY_BUFFER, linePosBuffer, gl.DYNAMIC_DRAW)
  gl.vertexAttribPointer(program.vPos, 2, gl.FLOAT, false, 0, 0)

  gl.bindBuffer(gl.ARRAY_BUFFER, b2)
  gl.enableVertexAttribArray(program.vStroke)
  gl.bufferData(gl.ARRAY_BUFFER, colorBuffer, gl.DYNAMIC_DRAW)
  gl.vertexAttribPointer(program.vStroke, 1, gl.FLOAT, false, 0, 0)

  gl.bindBuffer(gl.ARRAY_BUFFER, b3)
  gl.enableVertexAttribArray(program.vFill)
  gl.bufferData(gl.ARRAY_BUFFER, colorBuffer, gl.DYNAMIC_DRAW)
  gl.vertexAttribPointer(program.vFill, 1, gl.FLOAT, false, 0, 0)

  pathgl.uniform('type', 0)

  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, b4)
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, lineBuffer, gl.DYNAMIC_DRAW)
  gl.drawElements(gl.LINES, 1e6, gl.UNSIGNED_SHORT, 0)

}
