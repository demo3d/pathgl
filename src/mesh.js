function Mesh (gl, primitive) {
  var attributes = {}
    , count = 0
    , attrList = ['pos', 'color', 'fugue']

  primitive = gl[primitive]

  init()
  return {
    init : init
  , free: free
  , plus1: plus1
  , draw: draw
  , bind: bind
  , attributes: attributes
  , set: set
  , addAttr: addAttr
  , removeAttr: removeAttr
  , boundingBox: boundingBox
  }

  function plus1() {
    count += 1
  }

  function init (){
    attrList.forEach(function (name, i) {
      var buffer = gl.createBuffer()
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
      gl.bufferData(gl.ARRAY_BUFFER, 4 * 1e7, gl.STREAM_DRAW)
      var size = name == 'pos' && primitive == gl.LINES  ? 2 : 4
      attributes[name] = {
        array: new Float32Array(4e5)
      , buffer: buffer
      , size: size
      , changed: true
      , loc: i
      }
    })
  }

  function free (index) {
    var i, attr
    for(attr in attributes) {
      attr = attributes
      i = attr.size
      while(i--) attributes[index * attr.size + i] = 0
    }
  }

  function bind (obj) {
    obj.posBuffer = attributes.pos.array
    obj.fBuffer = attributes.fugue.array
    obj.colorBuffer = attributes.color.array
    obj.mesh = this
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
    if (count)
      gl.drawArrays(primitive, offset, count)
  }
  function set () {}
  function addAttr () {}
  function removeAttr () {}
  function boundingBox() {}
}

function renderToTexture(fbo, width, height) {
  width = width || 512
  height = height || 512

  gl.bindFramebuffer(gl.FRAMEBUFFER, fbo)
  fbo.width = width
  fbo.height = height

  var texture = gl.createTexture()
  texture.complete = true
  gl.bindTexture(gl.TEXTURE_2D, texture)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST)
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true)

  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null)

  gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0)

  gl.bindTexture(gl.TEXTURE_2D, null )
  gl.bindFramebuffer(gl.FRAMEBUFFER, null)
  return texture
}

function RenderTarget (screen, fbo) {
  screen.types = SVGProxy()
  if (fbo) var texture = renderToTexture(fbo)
  var gl = screen.gl
    , meshes = buildBuffers(gl, screen.types)
    , i = 0
  flags(gl)

  return { update: update , texture: texture }

  function update () {
    gl.bindFramebuffer(gl.FRAMEBUFFER, fbo)
    bindTextures()
    //setstates
    flags(gl)
    beforeRender(gl)
    pathgl.uniform('clock', new Date - start)
    for(i = -1; ++i < meshes.length;) meshes[i].draw()
    //cleanup
    gl.bindFramebuffer(gl.FRAMEBUFFER, null)
  }

  function bindTextures (){
    if (fbo)  return
    if (textures.null[0])
      gl.bindTexture(gl.TEXTURE_2D, textures.null[0].data)
  }
  function beforeRender(gl) { gl.clear(gl.COLOR_BUFFER_BIT) }
}

function buildBuffers(gl, types) {
  var pointMesh = new Mesh(gl, 'points')
  pointMesh.bind(types.circle)
  pointMesh.bind(types.rect)

  var lineMesh = new Mesh(gl, 'lines')
  lineMesh.bind(types.line)
  return [pointMesh, lineMesh]
  //pull scenegraph definition into here instead of pushing onto it
  //pathMesh
  //textmesh
}
