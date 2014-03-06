var textures = {null: []}

pathgl.texture = function (image, options, target) {
  var self = Object.create(Texture)
  var tex = gl.createTexture()

  self.gl = gl
  if (null == image)
    image = RenderTarget(self, initTexture2(tex))

  if ('string' == typeof image) image = parseImage(image)

  extend(self, options, {
    image: image
  , target: target || null
  , data: tex
  , width: image.width
  , height: image.height
  , update: image.update || self.update
  })

  target = self.target
  ;(textures[target] || (textures[target] = [])).push(self)

  return self.load()
}

var Texture = {
  update: initTexture
, forEach: function () {}
, load: function ()  {
    var image = this.image

    if (image.complete || image.readyState == 4) this.update()
    else image.addEventListener && image.addEventListener('load', this.update.bind(this))

    return this
  }
, unfold: function (attrList) {
    return pathgl.shader()
  }
, repeat: function () {
    setInterval(this.update.bind(this), 15)
  }
, appendChild: function (el) {
    return (types[el.toLowerCase()] || noop)(el)
  }
, valueOf: function () {
    return - 1
  }
, ownerDocument: { createElementNS: function (_, tag) { return tag}
                 }
}

function updateTexture() {

}

function initTexture() {
  gl.bindTexture(gl.TEXTURE_2D, this.data)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST)
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true)
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this.image)

if (powerOfTwo(this.width) && powerOfTwo(this.height)) gl.generateMipmap(gl.TEXTURE_2D)
}

function parseImage (image) {
  var query = document.querySelector(image)
  if (query) return query
  return extend(isVideoUrl ? new Image : document.createElement('video'), { src: image })
}

function isShader() {
  return false
}
