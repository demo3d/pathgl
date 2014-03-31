var pathgl = this.pathgl = {}
pathgl.sim = {}
pathgl.stop = function () {}
pathgl.context = function () { return gl }

var inited = 0
var tasksOnce = []
pathgl.texture = function (image) {
  if (! inited) pathgl.init('canvas')
  return new Texture(image)
}

pathgl.uniform = function (attr, value) {
  return arguments.length == 1 ? uniforms[attr] : uniforms[attr] = value
}

pathgl.applyCSS = applyCSSRules


HTMLCanvasElement.prototype.appendChild = function (el) {
  if (pathgl.init(this)) return this.appendChild(el)
}

var gl, program, programs
var textures = { null: [] }
var stopRendering = false
var tasks = []
var uniforms = {}
var start = Date.now()

pathgl.init = function (canvas) {
  inited = 1
  canvas = 'string' == typeof canvas ? document.querySelector(canvas) :
    canvas instanceof d3.selection ? canvas.node() :
    canvas

  if (! canvas.getContext) return console.log(canvas, 'is not a valid canvas')
  return !! init(canvas)
}