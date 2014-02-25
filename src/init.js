var stopRendering = false

pathgl.stop = function () { stopRendering = true }

function init(c) {
  if (! (gl = initContext(canvas = c)))
    return console.log('webGL context could not be initialized') || null
  program = initProgram()
  monkeyPatch(canvas)
  bindEvents(canvas)
  flags(canvas)
  startDrawLoop()
  return canvas
}

function flags() {
  gl.disable(gl.SCISSOR_TEST)
  gl.stencilMask(1, 1, 1, 1)
  gl.clear(gl.COLOR_BUFFER_BIT)
  gl.colorMask(true, true, true, true)
  gl.disable(gl.BLEND)
  gl.enable(gl.CULL_FACE)
}

function bindEvents(canvas) {
  setInterval(function () {
    pathgl.uniform('resolution', [canvas.width, canvas.height])
  }, 50)
  canvas.addEventListener('click', clicked)
  canvas.addEventListener('mousemove', mousemoved)
  canvas.addEventListener('touchmove', touchmoved)
  canvas.addEventListener('touchstart', touchmoved)
}

function clicked () {

}

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
  extend(window.d3.selection.prototype, {
    pAttr: d3_pAttr
  , shader: d3_shader
  })

  extend(canvas, {
    appendChild: appendChild
  , querySelectorAll: querySelectorAll
  , querySelector: function (s) { return this.querySelectorAll(s)[0] }
  , removeChild: removeChild
  , insertBefore: insertBefore

  , gl: gl
  , __scene__: []
  , __pos__: []
  , __program__: void 0
  })
}

function initContext(canvas) {
  var gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl')
  return gl && extend(gl, { viewportWidth: canvas.width, viewportHeight: canvas.height })
}

function d3_pAttr(obj) {
  //check if svg
  this.each(function(d) {
    for(var attr in obj)
      this.posBuffer[this.indices[0] + this.schema.indexOf(attr)] = obj[attr](d)
  })
    pointsChanged = true
  return this
}


function d3_shader(attr, name) {
  if(arguments.length == 2) {
    var args = {}
    args[attr] = name
  }
  initProgram(args || attr)
  return this
}

var raf = window.requestAnimationFrame
       || window.webkitRequestAnimationFrame
       || window.mozRequestAnimationFrame
       || function(callback) { window.setTimeout(callback, 1000 / 60) }
