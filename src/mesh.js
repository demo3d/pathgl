//pointmesh
//linemesh
//polygonmesh
function Mesh (primitive) {
  var attributes = {}
    , count = 2e5
    , attrList = ['pos', 'color', 'fugue']
    , program = initProgram()

  init()
  return {
    init : init
  , draw: draw
  , attributes: attributes
  , set: set
  , addAttr: addAttr
  , removeAttr: removeAttr
  , boundingBox: boundingBox
  }

  function init (){
    attrList.forEach(function (name, i) {
      var buffer = gl.createBuffer()
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
      gl.bufferData(gl.ARRAY_BUFFER, 4e6, gl.STREAM_DRAW)
      attributes[name] = {
        array: new Float32Array(1e6)
      , buffer: buffer
      , size: 0
      , changed: true
      , loc: i
      }
    })
  }

  function draw (offset) {
    //gl.use(program)
    for (var attr in attributes) {
      attr = attributes[attr]
      gl.bindBuffer(gl.ARRAY_BUFFER, attr.buffer)
      gl.vertexAttribPointer(attr.loc, 4, gl.FLOAT, false, 0, 0)
      gl.enableVertexAttribArray(attr.loc)
      if (attr.changed)
        gl.bufferSubData(gl.ARRAY_BUFFER, 0, attr.array)
    }

    gl.drawArrays(primitive, offset, count)
  }
  function set () {}
  function addAttr () {}
  function removeAttr () {}
  function boundingBox() {}
}
