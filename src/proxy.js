var pointsChanged = true
var pointCount = 0
var lineCount = 0
var linesChanged = true

fBuffer = null
colorBuffer = null

function buildBuffers(){
  pointMesh = new Mesh(gl.POINTS)
  pointMesh.bind(proto.circle)

  lineMesh = new Mesh(gl.LINES)
  lineMesh.bind(proto.line)
}

var proto = {
  circle: { cx: function (v) {
              this.posBuffer[this.indices[0] + 0] = v

            }
          , cy: function (v) {
              this.posBuffer[this.indices[0] + 1] = v
            }
          , r: function (v) {
             this.posBuffer[this.indices[0] + 2] = v
            }

          , cz: function (v) {
              this.posBuffer[this.indices[0] + 3] = v
            }
          , fill: function (v) {
              this.colorBuffer[this.indices[0]] = v < 0 ? v : parseColor(v)
            }

          , stroke: function (v) {
              this.colorBuffer[this.indices[0]] = parseColor(v)
            },
            opacity: function () {
            }
          , posBuffer: null
          }
, ellipse: { cx: noop, cy: noop, rx: noop, ry: noop } //points
, rect: { fill: function (v) {
            this.colorBuffer[this.indices[0] / 4] = v < 0 ? v : parseColor(v)
          }
        , width: function (v) {
            this.posBuffer[this.indices[0] + 2] = v
          }
        , height: function (v) {
            this.posBuffer[this.indices[0] + 3] = v
          }
        , x: function (v){
            this.posBuffer[this.indices[0] + 0] = v
          }
        , y: function (v) {
            this.posBuffer[this.indices[0] + 1] = v
          }
        , rx: noop,
          ry:  noop
        }
, image: { 'xlink:href': noop, height: noop, width: noop, x: noop, y: noop }

, line: { x1: function (v) { this.posBuffer[this.indices[0] * 2] = v }
        , y1: function (v) { this.posBuffer[this.indices[0] * 2 + 1] = v }
        , x2: function (v) { this.posBuffer[this.indices[1] * 2] = v }
        , y2: function (v) { this.posBuffer[this.indices[1] * 2  + 1] = v }
        , stroke: function (v) {
            var fill = parseColor(v)
            this.indices.forEach(function (i) {
              this.colorBuffer[i] = parseInt(fill.toString().slice(1), 16)
            }, this)
          }
        }
, path: { d: buildPath
        , pathLength: noop
        , stroke: function (v) {
            var fill = parseColor(v)
            this.indices.forEach(function (i) {
              this.colorBuffer[i / 2] = + parseInt(fill.toString().slice(1), 16)
            }, this)
          }
        }

, polygon: { points: noop }
, polyline: { points: noop }
, g: { appendChild: function (tag) { this.children.push(appendChild(tag)) },  ctr: function () { this.children = [] } }
, text: { x: noop, y: noop, dx: noop, dy: noop }
}

var baseProto = extend(Object.create(null), {
  querySelectorAll: querySelectorAll
, children: Object.freeze([])
, ctr: constructProxy
, querySelector: function (s) { return this.querySelectorAll(s)[0] }
, createElementNS: noop
, insertBefore: noop
, ownerDocument: { createElementNS: noop }
, render: function render(node) {
  this.buffer && drawFill(this)
  drawStroke(this)
}
, previousSibling: function () { canvas.scene[canvas.__scene__.indexOf(this) - 1] }
, nextSibling: function () { canvas.scene[canvas.__scene__.indexOf()  + 1] }
, parent: function () { return __scene__ }

, transform: function (d) {
  }

, getAttribute: function (name) {
    return this.attr[name]
  }

, setAttribute: function (name, value) {
    if (value.ctr == Texture) value = + value
    pointsChanged = true
    linesChanged = true
    this.attr[name] = value
    this[name] && this[name](value)
  }

, style: { setProperty: noop }

, removeAttribute: function (name) {
    delete this.attr[name]
  }

, textContent: noop
, removeEventListener: noop
, addEventListener: event
})

var types = [
  function circle () {}
, function rect() {}
, function path() {}
, function ellipse() {}
, function line() {}
, function path() {}
, function polygon() {}
, function polyline() {}
, function rect() {}

, function image() {}
, function text() {}
, function g() {}
].reduce(function (a, type) {
              a[type.name] = constructProxy(type)
              type.prototype = extend(Object.create(proto[type.name]), baseProto)
              return a
            }, {})

function buildPath (d) {
  parse.call(this, d, this.stroke(this.attr.stroke))
  this.stroke(this.attr.stroke)
}

function insertBefore(node, next) {
  var scene = canvas.__scene__
    , i = scene.indexOf(next)
  reverseEach(scene.slice(i, scene.push(0)),
              function (d, i) { scene[i] = scene[i - 1] })
  scene[i] = node
}

function appendChild(el) {
  return (types[el.tagName.toLowerCase()] || noop)(el.tagName)
}

function removeChild(el) {
  var i = this.__scene__.indexOf(el)

  el = this.__scene__.splice(i, 1)
  el.indices.forEach(function (i) {
    this.buffer[i] = 0
    this.buffer[i + 1] = 0
    this.buffer[i + 2] = 0
    this.buffer[i + 3] = 0
  })
  //el.buffer.changed = true
  //el.buffer.count -= 1
}

var attrDefaults = {
  rotation: [0, 1]
, translate: [0, 0]
, scale: [1, 1]
, fill: 0
, stroke: 0
, 'stroke-width': 2
, cx: 0
, cy: 0
, x: 0
, y: 0
, opacity: .999
}

function constructProxy(type) {
  return function (tagName) {
    var child = new type()

    var count = canvas.__scene__.push(child)

    var numArrays = 4

    child.attr = Object.create(attrDefaults)
    child.tag = tagName.toLowerCase()
    child.parentNode = child.parentElement = canvas

    var i = child.indices =
      type.name == 'line' ? [count, count + 1] :
      type.name == 'circle' ? [count * 4] :
      type.name == 'rect' ? [count * 4] :
      []

    if (type.name !== 'path')
      count += type.name == 'line' ? 2 : 1

    if (type.name == 'line')
      lineCount += 1

    if (type.name == 'circle') {
      pointCount += 1
      child.fBuffer[pointCount * 4] = 1
    }

    if (type.name == 'rect') {
      pointCount += 1
      child.fBuffer[pointCount * 4] = 0
    }
    return child
  }
}
var e = {}
function event (type, listener) {}

var tween = 'float x(i) { return a / b + b * i }'