HTMLCanvasElement.prototype.appendChild = function () {}

this.pathgl = pathgl

pathgl.stop = function () {}
pathgl.context = function () {}
pathgl.uniform = function () {}
pathgl.texture = function () {}

function pathgl(canvas) {
  var gl, program, programs

  if (canvas == null)
    canvas = document.body.appendChild(extend(document.createElement('canvas'), { height: 500, width: 960 }))

  canvas = 'string' == typeof canvas ? document.querySelector(canvas) :
    canvas instanceof d3.selection ? canvas.node() :
    canvas

  if (! canvas) return console.log('invalid selector')
  if (! canvas.getContext) return console.log(canvas, 'is not a valid canvas')