function Mesh (gl, options, attr) {
  var attributes = {}
    , count = attr ? attr.length : 0
    , attrList = options.attrList || ['pos', 'color', 'fugue']
    , primitive = gl[(options.primitive || 'triangle_fan') .toUpperCase()]

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

  function init() {
    attrList.forEach(function (name, i) {
      var buffer = gl.createBuffer()
      var option = options[name]  || {}
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
      gl.bufferData(gl.ARRAY_BUFFER, 4 * 1e7, gl.STREAM_DRAW)
      attributes[name] = {
        array: extend(new Float32Array(4e5), attr)
      , buffer: buffer
      , size: option.size  || 4
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

function RenderTarget(screen) {
  var gl = screen.gl
    , i = 0
    , fbo = screen.fbo || null
    , prog = screen.program
    , types = screen.types = SVGProxy()
    , meshes = buildBuffers(gl, screen.types)

  var bound_textures = false

  screen.mesh && meshes.push(screen.mesh)

  meshes.forEach(function (d) { d.mergeProgram = mergeProgram })

  if (fbo) initRtt.call(screen)

  return { update: update, append: append }

  function append(el) {
    return (types[el.toLowerCase()] || noop)(el)
  }

  function mergeProgram(d) {
    prog = createProgram(gl, build_vs(d), pathgl.fragmentShader)
  }

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
    if (! fbo) gl.clear( gl.COLOR_BUFFER_BIT)
    gl.viewport(0, 0, screen.width, screen.height)
  }
}

function buildBuffers(gl, types) {
  var pointMesh = new Mesh(gl, { primitive: 'points' })
  pointMesh.bind(types.circle)
  pointMesh.bind(types.rect)

  var lineMesh = new Mesh(gl, { primitive: 'lines', pos: { size: 2 }})
  lineMesh.bind(types.line)
  return [pointMesh, lineMesh]
}

function initRtt(width, height) {
  gl.bindFramebuffer(gl.FRAMEBUFFER, this.fbo)
  this.fbo.width = screen.width
  this.fbo.height = screen.height
  gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.data, 0)
}
