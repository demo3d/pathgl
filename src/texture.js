pathgl.texture = function (image, options) {
  if ('number' == typeof image) image = constructOffscreenRenderer(image)
  if ('string' == typeof image) image = parseImage(image)

  var self = {
    image: image
  , data: gl.createTexture()
  , width: image.width
  , height: image.height
  }

  return extend(Object.create(Texture), options, self).loaded()
}

var Texture = {
  update: update
, loaded: function ( )  {
    var image = this.image
    ;(image.complete || image.readyState == 4) ?
      this.update() : image.addEventListener('load', this.update.bind(this))
    return this
  }
, unfold: function (attrList) {
    return pathgl.shader()
  }
}

function update() {
  gl.bindTexture(gl.TEXTURE_2D, this.data)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST)
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true)
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this.image)
  if (powerOfTwo(this.width) && powerOfTwo(this.height)) gl.generateMipmap(gl.TEXTURE_2D)
}

function constructOffscreenRenderer() {}
//selector
//shader
//video
//image tag
//image data
//image url
//video url
//framebuffer
function parseImage (image) {
  var query = document.querySelector(image)
  if (query) return query
}

function isShader() {
  return false
}
