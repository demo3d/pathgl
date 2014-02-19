function Mesh (primitive, bufferlist) {
  this.buffers = {}

}


Mesh.prototype = {
  draw: function () {
    for (var b in this.buffers) {
      this.buffers[b]
      gl.bindBuffer(gl.ARRAY_BUFFER, this.buffers[b].buffer)
      gl.vertexAttribPointer(this.buffers[b].loc, this.buffers[b].length, gl.FLOAT, false, 0, 0)
      gl.enableVertexAttribArray(this.buffers[b].loc)
      if (this.buffers[b].changed)
        gl.bufferData(gl.array_buffer, this.buffers[b].array)
    }

    gl.drawArrays(this.primitive, this.offset, this.count)

  }
, set: function () {}
, addAttr: function () {}
, removeAttr: function () {}
, boundingBox: function () {}
}