//pointmesh
//linemesh
//polygonmesh
function Mesh (primitive, size) {
  var attributes = {}
    , count = 0
    , attrList = ['color', 'pos', 'fugue']
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
    attrList.forEach(function (name, i) {
      attributes[name] = {
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
    for (var attr in attributes) {
      attr = attributes[attributes]
      gl.bindBuffer(gl.ARRAY_BUFFER, attr.buffer)
      gl.vertexAttribPointer(attr.loc, attr.length, gl.FLOAT, false, 0, 0)
      gl.enableVertexAttribArray(attr.loc)
      if (attr.changed)
        gl.bufferData(gl.array_buffer, attr.array)
    }
    gl.drawArrays(primitive, offset, count)
  }
  function set () {}
  function addAttr () {}
  function removeAttr () {}
  function boundingBox() {}
}
