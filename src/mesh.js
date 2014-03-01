function Mesh (gl, primitive, attr) {
  var attributes = {}
    , count = 0
    , attrList = ['pos', 'color', 'fugue']
  var prim = primitive
  primitive = gl[primitive.toUpperCase()]

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
        array: extend(new Float32Array(4e5), attr)
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
    if (! count) return
    for (var attr in attributes) {
      attr = attributes[attr]
      gl.bindBuffer(gl.ARRAY_BUFFER, attr.buffer)
      gl.vertexAttribPointer(attr.loc, attr.size, gl.FLOAT, false, 0, 0)
      gl.enableVertexAttribArray(attr.loc)
      if (attr.changed)
        gl.bufferSubData(gl.ARRAY_BUFFER, 0, attr.array)
    }
    gl.drawArrays(primitive, offset || 0, count)
  }
  function set () {}
  function addAttr () {}
  function removeAttr () {}
  function boundingBox() {}
}

function RenderTarget (screen) {
  screen.types = SVGProxy()
  var gl = screen.gl
    , meshes = buildBuffers(gl, screen.types)
    , i = 0
    , fbo = screen.fbo || null
    , prog = screen.program

  var bound_textures = false
  screen.mesh && meshes.push(screen.mesh)
  if (fbo) initRtt.call(screen)

  return { update: update }

  function update () {
    if (program != prog) gl.useProgram(program = prog)
    gl.bindFramebuffer(gl.FRAMEBUFFER, fbo)
    bindTextures()
    beforeRender(gl)
    pathgl.uniform('clock', new Date - start)
    for(i = -1; ++i < meshes.length;) meshes[i].draw()
  }

  function bindTextures () {
    if ((textures[fbo] || []).length && bound_textures)
      gl.bindTexture(gl.TEXTURE_2D, textures[fbo][0].data),
      bound_textures = true
  }
  function beforeRender(gl) {
    if (!fbo) gl.clear( gl.COLOR_BUFFER_BIT)
    gl.viewport(0, 0, screen.width, screen.height)
  }
}

function buildBuffers(gl, types) {
  var pointMesh = new Mesh(gl, 'points')
  pointMesh.bind(types.circle)
  pointMesh.bind(types.rect)

  var lineMesh = new Mesh(gl, 'lines')
  lineMesh.bind(types.line)
  return [pointMesh, lineMesh]
}

function initRtt() {
  var width = 512, height = 512

  this.update()

  gl.bindFramebuffer(gl.FRAMEBUFFER, this.fbo)

  this.fbo.width = width
  this.fbo.height = height

  gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.data, 0)


  console.log(gl.checkFramebufferStatus(gl.FRAMEBUFFER))

  gl.bindFramebuffer(gl.FRAMEBUFFER, null)
}
