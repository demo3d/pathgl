var Texture = {
  init: initTexture
, pipe: pipeTexture
, update: function () {
    this.data ?
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this.data) :
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, this.width, this.height, 0, gl.RGBA, gl.FLOAT, null)
  }
, size: function (w, h) {
    if (! arguments.length) return this.width * this.height
    if (! h) this.height = w
    this.w = w
    return this
  }
, register: function () {
  }
, z: function () {
    var sq = Math.sqrt(this.size())
    return function (d, i) { return -1.0 / sq * ~~ (i % sq) }
  }
, x: function () {
    var sq = Math.sqrt(this.size())
    return function (d, i) { return -1.0 / sq * ~~ (i % sq) }
  }
, y: function () {
    var sq = Math.sqrt(this.size())
    return function (d, i) { return -1.0 / sq * ~~ (i / sq) }
  }
, forEach: function () {}
, load: function ()  {
    var image = this.data

    if (! image || image.complete || image.readyState == 4) this.init()
    else image.addEventListener && image.addEventListener('load', this.init.bind(this))

    return this
  }
, repeat: function () {
    this.task = this.update.bind(this)
    tasks.push(this.task)
    return this
  }

, stop : function () {
    this.task && tasks.splice(tasks.indexOf(this.task))
    delete this.task
  }
, appendChild: function (el) {
    return this.__scene__[this.__scene__.length] = this.__renderTarget__.append(el.tagName || el)
  }
, valueOf: function () {
    return - 1
  }
, copy: function () { return pathgl.texture(this.src) }
, pipe: pipeTexture
, querySelectorAll: querySelectorAll
, __scene__: []
, ownerDocument: { createElementNS: function (_, x) { return x } }
, unwrap: unwrap
}

extend(RenderTexture.prototype, appendable, Texture, {
  update: function () {
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, this.width, this.height, 0, gl.RGBA, gl.FLOAT, this.data || null)
  }
})
extend(DataTexture.prototype, Texture, {})

function RenderTexture(prog, options) {
  extend(this, {
    fbo: gl.createFramebuffer()
  , program: prog || program
  , gl: gl
  , texture: gl.createTexture()
  , width: 512
  , height: 512
  , mesh: Mesh(gl, { pos: { array: Quad(), size: 2 }
                   , attrList: ['pos']
                   , count: 4
                   , primitive: 'triangle_strip'
                   })
  }, options)

  this.texture.unit = 0

  this.init()
  this.__renderTarget__ = RenderTarget(this)
  console.log('beforestart')

  this.update = function () {
    this.step && this.step()
    this.__renderTarget__.update()
    this.__renderTarget__.update()
  }
}

function ShaderTexture (shader, options) {
  var prog = createProgram(gl, simulation_vs, shader, ['pos'])
  extend(options, {})
  return new RenderTexture(prog, options)
}

function DataTexture (image, options, target) {
  if ('string' == typeof image) image = parseImage(image)
  if ('number' == typeof image) options.width = options.height = Math.sqrt(image), image = false

  extend(this, {
    gl: gl
  , data: image
  , texture: gl.createTexture()
  , width: image.width || 512
  , height: image.height || 512
  }, options)

  this.load()
}

function initTexture() {
  gl.bindTexture(gl.TEXTURE_2D, this.texture)
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
  this.update()
}

function parseImage (image) {
  // string
  //   selector
  //   url
  // object
  //   video / image / canvas
  //   imageData
  //   typedarray
  //   array / nodelist
  var query = document.querySelector(image)
  if (query) return query

  return extend(isVideoUrl ? new Image : document.createElement('video'), { src: image })
}

function isShader(str) {
  return str.length > 50
}

function pipeTexture(destination) {

}

function unwrap() {
  var i = this.size() || 0, uv = new Array(i)
  while(i--) uv[i] = { x: this.x()(i, i), y: this.y(i, i)(i, i), z: this.z(i, i)(i, i) }
  return uv
}