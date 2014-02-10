var lineBuffer = new Uint16Array(4e4)
var linePosBuffer = new Float32Array(4e4)
var b1, b2, b3, b4
function initBuffers () {
  b1 = gl.createBuffer(), b2 = gl.createBuffer(), b3 = gl.createBuffer(), b4 = gl.createBuffer()
}

function drawLines(){
  if (! b1) initBuffers()
  if (! lineCount) return
  if (linesChanged){

    gl.bindBuffer(gl.ARRAY_BUFFER, b1)
    gl.bufferData(gl.ARRAY_BUFFER, linePosBuffer, gl.DYNAMIC_DRAW)
    gl.vertexAttribPointer(program.pos, 2, gl.FLOAT, false, 0, 0)
    gl.enableVertexAttribArray(program.pos)

    gl.bindBuffer(gl.ARRAY_BUFFER, b2)
    gl.bufferData(gl.ARRAY_BUFFER, colorBuffer, gl.DYNAMIC_DRAW)
    gl.vertexAttribPointer(program.fill, 1, gl.FLOAT, false, 0, 0)
    gl.enableVertexAttribArray(program.fill)

    gl.bindBuffer(gl.ARRAY_BUFFER, b3)
    gl.bufferData(gl.ARRAY_BUFFER, colorBuffer, gl.DYNAMIC_DRAW)
    gl.vertexAttribPointer(program.stroke, 1, gl.FLOAT, false, 0, 0)
    gl.enableVertexAttribArray(program.stroke)

    pathgl.uniform('type', 0)
    linesChanged = false
  }

  gl.drawArrays(gl.LINES, 0, lineCount)
}
