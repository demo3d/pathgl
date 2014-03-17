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
, update: updateTexture
, forEach: function () {}
, load: function ()  {
    var image = this.image

    if (image.complete || image.readyState == 4) this.init()
    else image.addEventListener && image.addEventListener('load', this.init)

    return this
  }
, unfold: function (attrList) {
    return pathgl.shader()
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

extend(ShaderTexture.prototype, Texture, {
  update: function () { this.step && this.step(this.gl, this.data, 0, 100, { x: 500, y: 500, z: 500 })
                        this.render.update()
  }
})
extend(RenderTexture.prototype, appendable, Texture, {})
extend(DataTexture.prototype, Texture, {})

function RenderTexture(prog, options) {
  extend(this, options, {
    fbo: gl.createFramebuffer()
  , program: prog || program
  , gl: gl
  , data: gl.createTexture()
  , image: null
  , width: 512
  , height: 512
  , mesh: Mesh (gl, {
    pos: { array: Quad(), size: 2 }
  , attrList: ['pos']
  }, ['pos'])
  })

  this.init()
  this.update = (this.__renderTarget__ = RenderTarget(this)).update
}

function ShaderTexture (shader, options) {
  var prog = createProgram(gl, simulation_vs, shader, ['pos'])
  extend(options, {

  })
  prog.force = true
  return new RenderTexture(prog, options)
}

function DataTexture (image, options, target) {
  if ('string' == typeof image) image = parseImage(image)

  extend(this, options, {
    gl: gl
  , image: image
  , data: gl.createTexture()
  , width: image.width || 512
  , height: image.height || 512
  }).load()
}

function updateTexture() {
  this.image ?
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this.image) :
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 512, 512, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
}

function initTexture() {
  gl.bindTexture(gl.TEXTURE_2D, this.data)
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
  this.update()
}

function parseImage (image) {
  // string
  //   url
  //   selector
  // object
  //   video / image
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
