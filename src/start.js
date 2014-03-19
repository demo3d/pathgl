var pathgl = this.pathgl = {}
pathgl.stop = function () {}
pathgl.context = function () {}
pathgl.texture = function (image, options, target) {
  return new (image == null ? RenderTexture :
          isShader(image) ? ShaderTexture :
          DataTexture)(image, extend(options || {}, { src: image }), target)
}
HTMLCanvasElement.prototype.appendChild = function (el) {
  pathgl.init(this)
  return this.appendChild(el)
}

var gl, program, programs
var textures = { null: [] }
var stopRendering = false
var tasks = []
var uniforms = {}
var start = Date.now()

pathgl.init = function (canvas) {
  canvas = 'string' == typeof canvas ? document.querySelector(canvas) :
    canvas instanceof d3.selection ? canvas.node() :
    canvas

  if (! canvas.getContext) return console.log(canvas, 'is not a valid canvas')
  init(canvas)
}