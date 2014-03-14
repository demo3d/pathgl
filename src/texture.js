var textures = { null: [] }

//texture data - img,canv,vid, url,
//tetxure target - construct render target
//texture shader - construct render target & add mesh

//shaderTexture
//imageTexture
//renderTexture

pathgl.texture = function (image, options, target) {
  return (image == null ? initRenderTexture :
          isShader(image) ? initShaderTexture :
          initDataTexture)(image, options || {}, target)
}

function initRenderTexture(prog, options) {
  var self = {}
  self.program = prog || program
  self.fbo = gl.createFramebuffer()
  var render = RenderTarget(self)
  self.update = function ( ) {
    options.step && options.step(gl, tex, 0, 100, { x: 500, y: 500, z: 500 })
    render.update()
  }
}

function initShaderTexture (shader, options) {
  return renderTexture()
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 512, 512, 0, gl.RGBA, gl.FLOAT, this.data)
}

function initDataTexture (image, options, target) {
  if ('string' == typeof image) image = parseImage(image)

  return extend(Object.create(Texture), options, {
    image: image
  , width: image.width || 512
  , data: gl.createTexture()
  , height: image.height || 512
  , gl: gl
  }).load()
}


var Texture = {
  update: initTexture
, forEach: function () {}
, load: function ()  {
    var image = this.image

    if (image.complete || image.readyState == 4) this.update()
    else image.addEventListener && image.addEventListener('load', this.update)

    return this
  }
, unfold: function (attrList) {
    return pathgl.shader()
  }
, repeat: function () {
    setInterval(this.update.bind(this), 15)
  }
, appendChild: function (el) {
    return (this.types[el.toLowerCase()] || noop)(el)
  }
, valueOf: function () {
    return - 1
  }
, querySelectorAll: querySelectorAll
, __scene__: []
, ownerDocument: { createElementNS: function (_, x) { return x } }
}

Texture = extend(Object.create(appendable), Texture)

function updateTexture() {
  gl.bindTexture(gl.TEXTURE_2D, this.data)
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this.image || null)
  gl.bindTexture(gl.TEXTURE_2D, null)
}


function updateTexture(image) {
}

function initTexture(image) {
  gl.bindTexture(gl.TEXTURE_2D, this.data)
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)

  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this.image)
  //if (powerOfTwo(this.width) && powerOfTwo(this.height)) gl.generateMipmap(gl.TEXTURE_2D)
}

function parseImage (image) {
  var query = document.querySelector(image)
  if (query) return query
  return extend(isVideoUrl ? new Image : document.createElement('video'), { src: image })
}

function isShader(str) {
  return str.length > 50
}

function d3_selection_selector(selector) {
  return typeof selector === "function" ? selector :
    function() { return d3_select(selector, this) }
}
