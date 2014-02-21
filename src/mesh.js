function Mesh (primitive, bufferlist) {
  var buffers = {}
    , count = 0

  return {draw: draw
         , set: set
         , addAttr: addAttr
         , removeAttr: removeAttr
         , boundingBox: boundingBox}

  function draw (offset) {
    for (var b in this.buffers) {
      buffers[b]
      gl.bindBuffer(gl.ARRAY_BUFFER, buffers[b].buffer)
      gl.vertexAttribPointer(buffers[b].loc, buffers[b].length, gl.FLOAT, false, 0, 0)
      gl.enableVertexAttribArray(buffers[b].loc)
      if (buffers[b].changed)
        gl.bufferData(gl.array_buffer, buffers[b].array)
    }

    gl.drawArrays(primitive, offset, count)
  }
}
