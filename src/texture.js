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
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([0, 0, 255, 150]))
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1)
  gl.bindTexture(gl.TEXTURE_2D, text)
  image.addEventListener('load', function () {
    console.log('1')
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA,gl.UNSIGNED_BYTE, image)
    gl.generateMipmap(gl.TEXTURE_2D)
  })
}

pathgl.texture.prototype