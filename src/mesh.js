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
  , bind: bind
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
      var size = primitive == gl.LINES  ? 2 : 4
      attributes[name] = {
        array: new Float32Array(1e6)
      , buffer: buffer
      , size: size
      , changed: true
      , loc: i
      }
    })
  }

  function bind (obj) {
    obj.posBuffer = this.attributes.pos.array
    obj.fBuffer = this.attributes.fugue.array
    obj.colorBuffer = this.attributes.color.array
  }

  function draw (offset) {
    //gl.use(program)
    for (var attr in attributes) {
      attr = attributes[attr]
      gl.bindBuffer(gl.ARRAY_BUFFER, attr.buffer)
      gl.vertexAttribPointer(attr.loc, attr.size, gl.FLOAT, false, 0, 0)
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
