pathgl.texture = function (image, options) {
  if ('string'== typeof image) image = document.querySelector(image)
  //selector
  //shader
  //video
  //image tag
  //image data
  //image url
  //video url
  //framebuffer
  options = options || {}
  this.format = options.format || gl.RGBA
  this.type = options.type || gl.UNSIGNED_BYTE
  var text = gl.createTexture()
  gl.bindTexture(gl.TEXTURE_2D, text)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST)
  image.addEventListener('load', function () {
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image)
  })
}

pathgl.texture.prototype