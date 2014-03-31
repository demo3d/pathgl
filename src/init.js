function init(c) {
  if (! (gl = initContext(canvas = c)))
    return !! console.log('webGL context could not be initialized')

  if (! gl.getExtension('OES_texture_float'))
    console.warn('does not support floating point textures')

  program = createProgram(gl, build_vs(), pathgl.fragmentShader)
  canvas.program = program
  monkeyPatch(canvas)
  bindEvents(canvas)
  var main = RenderTarget(canvas)
  tasks.push(main.update)
  gl.clearColor(.3, .3, .3, 1.)
  flags(gl)
  startDrawLoop()
  return canvas
}

function flags(gl) {
  gl.blendEquation(gl.FUNC_ADD)
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE)
  gl.blendColor(1,1,1,1)
}

function bindEvents(canvas) {
  setInterval(resizeCanvas, 100)

  function resizeCanvas(v) {
    pathgl.uniform('resolution', [canvas.width || 960, canvas.height || 500])
  }

  canvas.addEventListener('click', clicked)
  canvas.addEventListener('mousemove.pathgl', mousemoved)
  canvas.addEventListener('touchmove.pathgl', touchmoved)
  canvas.addEventListener('touchstart.pathgl', touchmoved)
}

function clicked () {}

function mousemoved(e) {
  var rect = canvas.getBoundingClientRect()
  pathgl.uniform('mouse', [ e.clientX - rect.left - canvas.clientLeft, e.clientY - rect.top - canvas.clientTop ])
}

function touchmoved(e) {
  var rect = canvas.getBoundingClientRect()
  e = e.touches[0]
  pathgl.uniform('mouse', [ e.clientX - rect.left - canvas.clientLeft, e.clientY - rect.top - canvas.clientTop ])
}

function monkeyPatch(canvas) {
  if(window.d3)
    extend(window.d3.selection.prototype, {
      vAttr: d3_vAttr
    , shader: d3_shader
    })
  if (window.d3)
    extend(window.d3.transition.prototype, {
      vAttr: d3_vAttr
    , shader: d3_shader
    })
  extend(canvas, appendable).gl = gl
}

var appendable = {
    appendChild: appendChild
  , querySelectorAll: querySelectorAll
  , querySelector: function (s) { return this.querySelectorAll(s)[0] }
  , removeChild: removeChild
  , insertBefore: insertBefore
  , __scene__: []

  , __program__: void 0
}

function initContext(canvas) {
  var gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl')
  return gl && extend(gl, { viewportWidth: canvas.width, viewportHeight: canvas.height })
}

function d3_vAttr(attr, fn) {
  this.each(function(d, i) {
    this.colorBuffer[this.indices[0]] = parseColor(fn(d, i))
  })
  return this
}

function d3_shader(attr, name) {
  this.node().mesh.mergeProgram(attr)
  return this
}

var raf = window.requestAnimationFrame
       || window.webkitRequestAnimationFrame
       || window.mozRequestAnimationFrame
       || function(callback) { window.setTimeout(callback, 1000 / 60) }

function startDrawLoop() {
  var l = tasks.length
  while(l--) tasks[l]()

  l = tasksOnce.length
  while(l--) tasksOnce.pop()()

  raf(startDrawLoop)
}
