//pointmesh
//linemesh
//polygonmesh
function Mesh (primitive, size) {
  var buffers = {}
    , count = 0
    , bufferList = ['color', 'pos', 'fug']
    , program = initProgram()

  init()
  return {
    init : init
  , draw: draw
  , set: set
  , addAttr: addAttr
  , removeAttr: removeAttr
  , boundingBox: boundingBox
  }

  function init (){
    bufferList.forEach(function (name, i) {
      buffers[name] = {
        array: new Float32Array(size)
      , buffer: gl.createBuffer()
      , size: 0
      , changed: true
      , loc: i
      }
    })
  }

  function draw (offset) {
    gl.use(program)
    for (var b in buffers) {
      buffers[b]
      gl.bindBuffer(gl.ARRAY_BUFFER, buffers[b].buffer)
      gl.vertexAttribPointer(buffers[b].loc, buffers[b].length, gl.FLOAT, false, 0, 0)
      gl.enableVertexAttribArray(buffers[b].loc)
      if (buffers[b].changed)
        gl.bufferData(gl.array_buffer, buffers[b].array)
    }

    gl.drawArrays(primitive, offset, count)
  }

  function set () {}
  function addAttr () {}
  function removeAttr () {}
  function boundingBox() {}
}
