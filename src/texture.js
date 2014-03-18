var textures = { null: [] }

//texture data - img,canv,vid, url,
//tetxure target - construct render target
//texture shader - construct render target & add mesh

//shaderTexture
//imageTexture
//renderTexture

pathgl.texture = function (image, options, target) {
  return new (image == null ? RenderTexture :
          isShader(image) ? ShaderTexture :
          DataTexture)(image, options || {}, target)
}

var Texture = {
  init: initTexture
, update: function () { gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this.data) }
, forEach: function () {}
, load: function ()  {
    var image = this.data

    if (image.complete || image.readyState == 4) this.init()
    else image.addEventListener && image.addEventListener('load', this.init)

    return this
  }
, repeat: function () {
    setInterval(this.update.bind(this), 15)
  }
, appendChild: function (el) {
    return this.__scene__[this.__scene__.length] = this.__renderTarget__.append(el.tagName || el)
  }
, valueOf: function () {
    return - 1
  }
, querySelectorAll: querySelectorAll
, __scene__: []
, ownerDocument: { createElementNS: function (_, x) { return x } }
}

extend(RenderTexture.prototype, appendable, Texture, {
  z: function () {
    var sq = Math.sqrt(this.size)
    return function (d, i) { return -1.0 / sq * ~~ (i % sq) }
  },
  x: function () {
    var sq = Math.sqrt(this.size)
    return function (d, i) { return -1.0 / sq * ~~ (i % sq) }
  },
  y: function () {
    var sq = Math.sqrt(this.size)
    return function (d, i) { return -1.0 / sq * ~~ (i / sq) }
  },
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
  , mesh: Mesh (gl, { pos: { array: Quad(), size: 2 }
                    , attrList: ['pos']
                    , count: 4
                    , primitive: 'triangle_strip'
                    })
  }, options)

  this.init()
  this.__renderTarget__ = RenderTarget(this)
  this.update = function () {

    d3.select('body').on('click', function () {
    var step = this.step && this.step(this.gl, this.texture)
    }.bind(this))
    this.__renderTarget__.update()
  }
}

function ShaderTexture (shader, options) {
  var prog = createProgram(gl, simulation_vs, shader, ['pos'])
  extend(options, {
  })
  return new RenderTexture(prog, options)
}

function DataTexture (image, options, target) {
  if ('string' == typeof image) image = parseImage(image)

  extend(this, {
    gl: gl
  , data: image
  , texture: gl.createTexture()
  , width: 512
  , height: 512
  }, image, options).load()
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
