! function() {
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
  if (! canvas.getContext) return console.log(canvas, 'is not a valid canvas');function parseColor(v) {
  var a = setStyle(v)
  return + ( a[0] * 255 ) << 16 ^ ( a[1] * 255 ) << 8 ^ ( a[2] * 255 ) << 0
}


function hexColor( hex ) {
  hex = Math.floor( hex )
  return [ (hex >> 16 & 255 ) / 255
         , (hex >> 8 & 255 ) / 255
         , (hex & 255 ) / 255]
}

function parse_hsl(h, s, l) {
  // h,s,l ranges are in 0.0 - 1.0
  if ( s === 0 ) {
    return [l, l, l]
  } else {
    var p = l <= 0.5 ? l * (1 + s) : l + s - (l * s)
    var q = ( 2 * l ) - p
    return [
      hue2rgb(q, p, h + 1 / 3)
    , hue2rgb(q, p, h)
    , hue2rgb(q, p, h - 1 / 3)
    ]
  }
}

function hue2rgb(p, q, t) {
  if (t < 0) t += 1
  if (t > 1) t -= 1
  if (t < 1 / 6) return p + (q - p) * 6 * t
  if (t < 1 / 2) return q
  if (t < 2 / 3) return p + (q - p) * 6 * (2 / 3 - t)
  return p

}

function setStyle(style) {
  if (cssColors[style])
    return hexColor(cssColors[style])

  if (/^hsl/i.test(style)) {
    var hsl = style.split(/,|\(/).map(parseFloat)
    return parse_hsl(hsl[1] / 360 , hsl[2] / 100, hsl[3] / 100)
  }

  if (/^rgb\((\d+), ?(\d+), ?(\d+)\)$/i.test(style)) {
    var color = /^rgb\((\d+), ?(\d+), ?(\d+)\)$/i.exec(style)
    return [ Math.min(255, parseInt(color[1], 10)) / 255
           , Math.min(255, parseInt(color[2], 10)) / 255
           , Math.min(255, parseInt(color[3], 10)) / 255
           ]
  }

  if (/^rgb\((\d+)\%, ?(\d+)\%, ?(\d+)\%\)$/i.test(style)) {
    var color = /^rgb\((\d+)\%, ?(\d+)\%, ?(\d+)\%\)$/i.exec(style)
    return [ Math.min(100, parseInt(color[1], 10)) / 100
           , Math.min(100, parseInt(color[2], 10)) / 100
           , Math.min(100, parseInt(color[3], 10)) / 100
           ]
  }

  if (/^\#([0-9a-f]{6})$/i.test(style)) {
    var color = /^\#([0-9a-f]{6})$/i.exec(style)
    return hexColor( parseInt(color[1], 16))
  }

  if (/^\#([0-9a-f])([0-9a-f])([0-9a-f])$/i.test(style)) {
    var color = /^\#([0-9a-f])([0-9a-f])([0-9a-f])$/i.exec(style)
    return hexColor(parseInt(color[1] + color[1] + color[2] + color[2] + color[3] + color[3], 16))
  }

  return null
}

var cssColors = {
  "aliceblue": 0xF0F8FF, "antiquewhite": 0xFAEBD7, "aqua": 0x00FFFF, "aquamarine": 0x7FFFD4, "azure": 0xF0FFFF
, "beige": 0xF5F5DC, "bisque": 0xFFE4C4, "black": 0x000000, "blanchedalmond": 0xFFEBCD, "blue": 0x0000FF, "blueviolet": 0x8A2BE2
, "brown": 0xA52A2A, "burlywood": 0xDEB887, "cadetblue": 0x5F9EA0, "chartreuse": 0x7FFF00, "chocolate": 0xD2691E, "coral": 0xFF7F50
, "cornflowerblue": 0x6495ED, "cornsilk": 0xFFF8DC, "crimson": 0xDC143C, "cyan": 0x00FFFF, "darkblue": 0x00008B, "darkcyan": 0x008B8B
, "darkgoldenrod": 0xB8860B, "darkgray": 0xA9A9A9, "darkgreen": 0x006400, "darkgrey": 0xA9A9A9, "darkkhaki": 0xBDB76B
, "darkmagenta": 0x8B008B, "darkolivegreen": 0x556B2F, "darkorange": 0xFF8C00, "darkorchid": 0x9932CC, "darkred": 0x8B0000
, "darksalmon": 0xE9967A, "darkseagreen": 0x8FBC8F, "darkslateblue": 0x483D8B, "darkslategray": 0x2F4F4F, "darkslategrey": 0x2F4F4F
, "darkturquoise": 0x00CED1, "darkviolet": 0x9400D3, "deeppink": 0xFF1493, "deepskyblue": 0x00BFFF, "dimgray": 0x696969
, "dimgrey": 0x696969, "dodgerblue": 0x1E90FF, "firebrick": 0xB22222, "floralwhite": 0xFFFAF0, "forestgreen": 0x228B22
, "fuchsia": 0xFF00FF, "gainsboro": 0xDCDCDC, "ghostwhite": 0xF8F8FF, "gold": 0xFFD700, "goldenrod": 0xDAA520
, "gray": 0x808080, "green": 0x008000, "greenyellow": 0xADFF2F, "grey": 0x808080, "honeydew": 0xF0FFF0, "hotpink": 0xFF69B4
, "indianred": 0xCD5C5C, "indigo": 0x4B0082, "ivory": 0xFFFFF0, "khaki": 0xF0E68C, "lavender": 0xE6E6FA, "lavenderblush": 0xFFF0F5
, "lawngreen": 0x7CFC00, "lemonchiffon": 0xFFFACD, "lightblue": 0xADD8E6, "lightcoral": 0xF08080
, "lightcyan": 0xE0FFFF, "lightgoldenrodyellow": 0xFAFAD2, "lightgray": 0xD3D3D3
, "lightgreen": 0x90EE90, "lightgrey": 0xD3D3D3, "lightpink": 0xFFB6C1, "lightsalmon": 0xFFA07A, "lightseagreen": 0x20B2AA
, "lightskyblue": 0x87CEFA, "lightslategray": 0x778899, "lightslategrey": 0x778899, "lightsteelblue": 0xB0C4DE
, "lightyellow": 0xFFFFE0, "lime": 0x00FF00, "limegreen": 0x32CD32, "mediumpurple": 0x9370DB
, "mediumseagreen": 0x3CB371, "mediumslateblue": 0x7B68EE, "mediumspringgreen": 0x00FA9A, "mediumturquoise": 0x48D1CC
, "mediumvioletred": 0xC71585, "midnightblue": 0x191970, "mintcream": 0xF5FFFA, "mistyrose": 0xFFE4E1, "moccasin": 0xFFE4B5
, "navajowhite": 0xFFDEAD,"navy": 0x000080, "oldlace": 0xFDF5E6, "olive": 0x808000, "olivedrab": 0x6B8E23
, "orange": 0xFFA500, "orangered": 0xFF4500, "orchid": 0xDA70D6, "palegoldenrod": 0xEEE8AA, "palegreen": 0x98FB98
, "paleturquoise": 0xAFEEEE, "palevioletred": 0xDB7093, "papayawhip": 0xFFEFD5
, "peachpuff": 0xFFDAB9, "peru": 0xCD853F, "pink": 0xFFC0CB, "plum": 0xDDA0DD, "powderblue": 0xB0E0E6, "purple": 0x800080
, "red": 0xFF0000, "rosybrown": 0xBC8F8F, "royalblue": 0x4169E1, "saddlebrown": 0x8B4513, "salmon": 0xFA8072
, "sandybrown": 0xF4A460, "seagreen": 0x2E8B57, "seashell": 0xFFF5EE, "sienna": 0xA0522D, "silver": 0xC0C0C0, "skyblue": 0x87CEEB
, "slateblue": 0x6A5ACD, "slategray": 0x708090, "slategrey": 0x708090, "snow": 0xFFFAFA
, "springgreen": 0x00FF7F, "steelblue": 0x4682B4, "tan": 0xD2B48C, "teal": 0x008080, "thistle": 0xD8BFD8
, "tomato": 0xFF6347, "turquoise": 0x40E0D0, "violet": 0xEE82EE, "wheat": 0xF5DEB3, "white": 0xFFFFFF, "whitesmoke": 0xF5F5F5
, "yellow": 0xFFFF00, "yellowgreen": 0x9ACD32
}
;pathgl.texture = function (image, options) {
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

function constructOffscreenRenderer(num) {
  var prog = initProgram()
  this.fbo = gl.createFramebuffer()
  this.draw = function () {
    gl.useProgram(prog)
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0);
    //draw
    gl.bindFramebuffer(gl.FRAMEBUFFER, null)
  }
}
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
;pathgl.vertexShader = [
  'precision mediump float;'

, 'uniform float clock;'
, 'uniform vec2 mouse;'
, 'uniform vec2 resolution;'
, 'uniform vec2 dates;'

, 'attribute vec4 pos;'
//attribute vec4 color f, s, fo, so
, 'attribute float fill;'
, 'attribute float stroke;'
, 'attribute vec4 transform;'
, 'attribute vec4 fugue;'

, 'varying float type;'
, 'varying vec4 v_stroke;'
, 'varying vec4 v_fill;'

, 'vec3 unpack_color(float col) {'
, '    if (col == 0.) return vec3(0);'
, '    return vec3(mod(col / 256. / 256., 256.),'
, '                mod(col / 256. , 256.),'
, '                mod(col, 256.)) / 256.; }'

, 'void main() {'

, '    float x = replace_x;'
, '    float y = replace_y;'

, '    gl_Position = vec4(2. * (x / resolution.x) - 1., 1. - ((y / resolution.y) * 2.),  1., 1.);'

, '    type = fugue.x;'
, '    gl_PointSize =  replace_radius;'
, '    v_fill = vec4(unpack_color(fill), 1.);'
, '    v_stroke = replace_stroke;'
, '}'
].join('\n')

pathgl.fragmentShader = [
  'precision mediump float;'
, 'varying float type;'
, 'uniform sampler2D texture;'
, 'uniform vec2 resolution;'
, 'varying vec4 v_stroke;'
, 'varying vec4 v_fill;'

, 'void main() {'
, '    float dist = distance(gl_PointCoord, vec2(0.5));'
, '    if (type == 1. && dist > 0.5) discard;'
, '    gl_FragColor = texture2D(texture, gl_PointCoord);'
, '}'
].join('\n')

//type
//1 circle
//2 rect
//3 line
//4 path

function createProgram(vs, fs) {
  program = gl.createProgram()

  vs = compileShader(gl.VERTEX_SHADER, vs)
  fs = compileShader(gl.FRAGMENT_SHADER, fs)

  gl.attachShader(program, vs)
  gl.attachShader(program, fs)

  gl.deleteShader(vs)
  gl.deleteShader(fs)

  gl.bindAttribLocation(program, 0,  "pos")
  gl.bindAttribLocation(program, 1, "fill")
  gl.bindAttribLocation(program, 2, "stroke")
  //gl.bindAttribLocation(program, 3, "transform")
  gl.bindAttribLocation(program, 4, "fugue")


  gl.linkProgram(program)
  gl.useProgram(program)

  program.pos = 0;
  program.fill = 1;
  program.stroke = 2;
  program.fugue = 4;

  if (! gl.getProgramParameter(program, gl.LINK_STATUS)) throw name + ': ' + gl.getProgramInfoLog(program)

  each({ type: [0]
       , mouse: [0, 0]
       , dates: [0, 0]
       , resolution: [0, 0]
       , clock: [0]
       }, bindUniform)

  return program
}
function initProgram (subst) {
  each(subst || {}, function (v, k, o) {
    if (k == 'cx') o['x'] = v
    if (k == 'cy') o['y'] = v

  })
  var defaults = extend({
    stroke: 'vec4(unpack_color(stroke), 1.);'
  , radius: '2. * pos.z;'
  , x: 'pos.x;'
  , y: 'pos.y;'
  }, subst), vertex = pathgl.vertexShader

  for(var attr in defaults)
    vertex = vertex.replace('replace_'+attr, defaults[attr])

  return createProgram(vertex, pathgl.fragmentShader)
}

function compileShader (type, src) {
  var shader = gl.createShader(type)
  gl.shaderSource(shader, src)
  gl.compileShader(shader)
  if (! gl.getShaderParameter(shader, gl.COMPILE_STATUS)) throw src + ' ' + gl.getShaderInfoLog(shader)
  return shader
}

function bindUniform(val, key) {
  var loc = gl.getUniformLocation(program, key), keep
  ;(program[key] = function (data) {
      if (keep == data) return
      if (data == null) return keep
      gl['uniform' + val.length + 'fv'](loc, Array.isArray(data) ? data : [data])
      keep = data
  })(val)
}

pathgl.shader = function () {};var stopRendering = false

pathgl.stop = function () { stopRendering = true }

function init(c) {
  if (! (gl = initContext(canvas = c)))
    return console.log('webGL context could not be initialized') || null
  program = initProgram()
  monkeyPatch(canvas)
  bindEvents(canvas)
  flags(canvas)
  var start = Date.now()
  raf(function recur( ) {
    drawLoop(new Date - start)
    raf(recur)
  })
  return canvas
}

function flags () {
  gl.disable(gl.SCISSOR_TEST)
  gl.stencilMask(1, 1, 1, 1)
  //gl.clearColor(1,1,1,1);
  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.colorMask(true, true, true, true);
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
;function parse (str, stroke) {
  var buffer = [], lb = this.buffer, pb = this.posBuffer, indices = this.indices, count = 0
    , pos = [0, 0], l = indices.length, i = 0
    , origin = [0, 0]

  str.match(/[a-z][^a-z]*/ig).forEach(function (segment, i, match) {
    var points = segment.slice(1).trim().split(/,| /g), c = segment[0].toLowerCase(), j = 0

    while(j < points.length) {
      var x = points[j++], y = points[j++]
      c == 'm' ? origin = pos = [x, y] :
        c == 'l' ? buffer.push(pos[0], pos[1], x, y) && (pos = [x, y]) :
        c == 'z' ? buffer.push(pos[0], pos[1], origin[0], origin[1]) && (pos = origin):
        console.log('%d method is not supported malformed path:', c)
    }
  })

  while(indices.length < buffer.length) indices.push(lb.count + i++)
  if (indices.length > buffer.length) indices.length = buffer.length

  indices.forEach(function (d, i) {
    pb[3 * lb[d] + d % 3] = i < buffer.length && buffer[i]
  })

  lb.count += buffer.length - l
}

pathgl.uniform = function (attr, value) {
  if (program[attr]) return program[attr](value)
}


pathgl.applyCSS = applyCSSRules

function applyCSSRules () {
  var k =d3.selectAll('style')[0].map(function () { return this.sheet })
         .reduce(function (acc, item) {
           var itemRules = {}
           each(item.cssRules, function (rules, i) {
             var l = rules.length, cssom = {}
             while(l--) {
               var name = rules[rules[l]]
               cssom[name] = rules[name]
             }
             itemRules[rules.selectorText] = cssom
           })
             return extend(acc, itemRules)
         }, {})

  each(k, function (styles, selector) {
    d3.select(selector).attr(styles)
  })
}

function matchesSelector(selector) {
  if (isNode(selector)) return this == selector
  if (isFinite(selector.length)) return !!~flatten(selector).indexOf(this)
  for (var selectors = selector.split(','), tokens, dividedTokens; selector = selectors.pop(); tokens = selector.split(tokenizr).slice(0))
    if (interpret.apply(this, q(tokens.pop())) && (!tokens.length || ancestorMatch(this, tokens, selector.match(dividers)))) return true
};var p1, p2, p3, p4

function initBuffersp() {
  p1 = gl.createBuffer()
  p2 = gl.createBuffer()
  p3 = gl.createBuffer()
  p4 = gl.createBuffer()
}

function drawPoints(elapsed) {
  if( !p1) initBuffersp()

  var pointBuffer = canvas.pb
  var pointPosBuffer = canvas.ppb

  if (! pointCount) return
  if (pointsChanged) {
    gl.bindBuffer(gl.ARRAY_BUFFER, p1)
    gl.bufferData(gl.ARRAY_BUFFER, pointPosBuffer, gl.DYNAMIC_DRAW)
    gl.vertexAttribPointer(program.pos, 4, gl.FLOAT, false, 0, 0)
    gl.enableVertexAttribArray(program.pos)

    gl.bindBuffer(gl.ARRAY_BUFFER, p2)
    gl.bufferData(gl.ARRAY_BUFFER, colorBuffer, gl.DYNAMIC_DRAW)
    gl.vertexAttribPointer(program.fill, 1, gl.FLOAT, false, 0, 0)
    gl.enableVertexAttribArray(program.fill)

    gl.bindBuffer(gl.ARRAY_BUFFER, p3)
    gl.bufferData(gl.ARRAY_BUFFER, colorBuffer, gl.DYNAMIC_DRAW)
    gl.vertexAttribPointer(program.stroke, 1, gl.FLOAT, false, 0, 0)
    gl.enableVertexAttribArray(program.stroke)

    gl.bindBuffer(gl.ARRAY_BUFFER, p4)
    gl.bufferData(gl.ARRAY_BUFFER, fBuffer, gl.DYNAMIC_DRAW)
    gl.vertexAttribPointer(program.fugue, 4, gl.FLOAT, false, 0, 0)
    gl.enableVertexAttribArray(program.fugue)

    // gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, p4)
    // gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, pointBuffer, gl.DYNAMIC_DRAW)
    pointsChanged = false
  }
  gl.drawArrays(gl.POINTS, 0, pointCount)

  // gl.drawElements(gl.POINTS, pointBuffer.count * 4, gl.UNSIGNED_SHORT, 0)
}
;var lineBuffer = new Uint16Array(4e4)
var linePosBuffer = new Float32Array(4e4)
var b1, b2, b3, b4
function initBuffers () {
  b1 = gl.createBuffer(), b2 = gl.createBuffer(), b3 = gl.createBuffer(), b4 = gl.createBuffer()
}

function drawLines(){
  if (! b1) initBuffers()
  if (! lineCount) return
  if (linesChanged){

    gl.bindBuffer(gl.ARRAY_BUFFER, b1)
    gl.bufferData(gl.ARRAY_BUFFER, linePosBuffer, gl.DYNAMIC_DRAW)
    gl.vertexAttribPointer(program.pos, 2, gl.FLOAT, false, 0, 0)
    gl.enableVertexAttribArray(program.pos)

    gl.bindBuffer(gl.ARRAY_BUFFER, b2)
    gl.bufferData(gl.ARRAY_BUFFER, colorBuffer, gl.DYNAMIC_DRAW)
    gl.vertexAttribPointer(program.fill, 1, gl.FLOAT, false, 0, 0)
    gl.enableVertexAttribArray(program.fill)

    gl.bindBuffer(gl.ARRAY_BUFFER, b3)
    gl.bufferData(gl.ARRAY_BUFFER, colorBuffer, gl.DYNAMIC_DRAW)
    gl.vertexAttribPointer(program.stroke, 1, gl.FLOAT, false, 0, 0)
    gl.enableVertexAttribArray(program.stroke)

    pathgl.uniform('type', 0)
    linesChanged = false
  }

  gl.drawArrays(gl.LINES, 0, lineCount)
}
;function drawPolygons() {


};function querySelectorAll(selector, r) {
  return selector.replace(/^\s+|\s*([,\s\+\~>]|$)\s*/g, '$1').split(',')
  .forEach(function (s) { query(s, this).forEach(push.bind(r = [])) }, this) || r
}

function query(selector, root) {
  var symbols = selector.split(/[\s\>\+\~](?![\s\w\-\/\?\&\=\:\.\(\)\!,@#%<>\{\}\$\*\^'"]*\]|[\s\w\+\-]*\))/)
    , dividedTokens = selector.match(/([\s\>\+\~])(?![\s\w\-\/\?\&\=\:\.\(\)\!,@#%<>\{\}\$\*\^'"]*\]|[\s\w\+\-]*\))/)
    , last = chunk(symbols.pop()), right = [], left = [], item

  byTagName.call(root, last[1] || '*').forEach(function (d) { if (item = checkRight.apply(d, last)) right.push(item) })
  return symbols.length ? right.forEach(function (e) { if (leftCheck(e, symbols, dividedTokens)) left.push(e) }) || left : right
}

function leftCheck(doc, symbols, divided, cand) {
  return cand = function recur(e, i, p) {
    while (p = combinators[divided[i]](p, e))
      if (checkRight.apply(p, chunk(symbols[i]))) {
        if (i) if (cand = recur(p, i - 1, p)) return cand
        else return p
      }
  }(doc, symbols.length - 1, doc)
}

function checkRight(_, tag, classId, attribute, attr, attrCmp, attrVal, _, pseudo, _, pseudoVal, m) {
  return pseudo && pseudos[pseudo] && !pseudos[pseudo](this, pseudoVal)
      || tag && tag !== '*' && this.tag && this.tag.toLowerCase() !== tag
      || attribute && !checkAttr(attrCmp, this[attr] || '', attrVal)
      || classId && (m = classId.match(/#([\w\-]+)/)) && m[1] !== this.id
      || classId && (classId.match(/\.[\w\-]+/g) || []).some(matchClass.bind(this)) ? 0 : this
}

function checkAttr(cmp, actual, val) {
  return actual.match(RegExp({ '='  : val
                             , '^=' : '^' + clean(val)
                             , '$=' : clean(val) + '$'
                             , '*=' : clean(val)
                             , '~=' : '(?:^|\\s+)' + clean(val) + '(?:\\s+|$)'
                             , '|=' : '^' + clean(val) + '(-|$)'
                             }[cmp] || 'adnan^'))
}

function chunk(query) { return query.match(chunker) }
function byId(id) { return querySelectorAll('[id="' + id + '"]')[0] }
function isNode(el) { return el && typeof el === 'object' }
function previous(n) { while (n = n.previousSibling()) if (n.top) return n }
function clean(s) { return s.replace(/([.*+?\^=!:${}()|\[\]\/\\])/, '\\$1') }
function matchClass(d) { return ! RegExp('(^|\\s+)' + d.slice(1) + '(\\s+|$)').test(this.class) }
function byClassName(name) { return traverse(this, function (doc) { return doc.class == name }, []) }
function byTagName(name) { return traverse(this, function (doc) { return name == '*' || doc.tag == name }, []) }
function traverse(node, fn, val) { return (node.__scene__ || node.children).forEach(function (node) { traverse(node, fn, val), fn(node) && val.push(node) }) || val }

var pseudos = {} //todo

var combinators = { ' ': function (d) { return d && d !== __scene__ && d.parent() }
                  , '>': function (d, maybe) { return d && d.parent() == maybe.parent() && d.parent() }
                  , '~': function (d) { return d && d.previousSibling() }
                  , '+': function (d, ct, p1, p2) { return ! d || ((p1 = previous(d)) && (p2 = previous(ct)) && p1 == p2 && p1) }
                  }
var chunker = //taken from sizle
  /^(\*|\w+)?(?:([\.\#]+[\w\-\.#]+)?)(\[([\w\-]+)(?:([\|\^\$\*\~]?\=)['"]?([ \w\-\/\?\&\=\:\.\(\)\!,@#%<>\{\}\$\*\^]+)["']?)?\])?(:([\w\-]+)(\(['"]?([^()]+)['"]?\))?)?/
;var bSize = 8e5
var colorBuffer = new Float32Array(bSize)
var pointsChanged = true
var pointCount = 0
var lineCount = 0
var linesChanged = true

var fBuffer = new Float32Array(bSize)
var proto = {
  circle: { r: function (v) {
              this.posBuffer[this.indices[0] + 2] = v
            }
          , cx: function (v) {
              this.posBuffer[this.indices[0] + 0] = v

            }
          , cy: function (v) {
              this.posBuffer[this.indices[0] + 1] = v
            }
          , cz: function (v) {
              this.posBuffer[this.indices[0] + 3] = v
            }
          , fill: function (v) {
              colorBuffer[this.indices[0] / 4] = parseColor(v)
            }

          , stroke: function (v) {
              return;
              colorBuffer[this.indices[0] / 4] = parseColor(v)
            },
            opacity: function () {
            }

          , buffer: canvas.pb = canvas.pb || new Uint16Array(bSize)
          , posBuffer: canvas.ppb = canvas.ppb ||  new Float32Array(bSize)
          , schema: ['cx', 'cy', 'r', 'cz']
          }
, ellipse: { cx: noop, cy: noop, rx: noop, ry: noop } //points
, rect: { fill: function (v) {
            colorBuffer[this.indices[0] / 4] = parseColor(v)
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
          ry:  noop,
          posBuffer: canvas.ppb
        }
  //, image: { 'xlink:href': noop, height: noop, width: noop, x: noop, y: noop }

, line: { x1: function (v) { this.posBuffer[this.indices[0] * 2] = v }
        , y1: function (v) { this.posBuffer[this.indices[0] * 2 + 1] = v }
        , x2: function (v) { this.posBuffer[this.indices[1] * 2] = v }
        , y2: function (v) { this.posBuffer[this.indices[1] * 2  + 1] = v }
        , posBuffer: linePosBuffer
        , stroke: function (v) {
            var fill = parseColor(v)
            this.indices.forEach(function (i) {
              colorBuffer[i] = parseInt(fill.toString().slice(1), 16)
            })
          }
        }
, path: { d: buildPath
        , pathLength: noop
        , posBuffer: linePosBuffer
        , stroke: function (v) {
            var fill = parseColor(v)
            this.indices.forEach(function (i) {
              colorBuffer[i / 2] = + parseInt(fill.toString().slice(1), 16)
            })
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

, fill: function (val) {
    isId(val) && initShader(document.querySelector(val).textContent, val)
  }

, transform: function (d) {
  }

, stroke: function (val) {
    isId(val) && initShader(document.querySelector(val).textContent, val)
  }

, getAttribute: function (name) {
    return this.attr[name]
  }

, setAttribute: function (name, value) {
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
, function use() {}
].reduce(function (a, type) {
              a[type.name] = constructProxy(type)
              type.prototype = extend(Object.create(baseProto), proto[type.name])
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
  return types[el.tagName.toLowerCase()](el)
}

function removeChild(el) {
  var i = this.__scene__.indexOf(el)

  this.__scene__.splice(i, 1)

  for(var k = 0; k < 4; k++)
    el.buffer[el.index + k] = 0

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
  return function (el) {
    var child = new type()
      , buffer = child.buffer || []

    var count = canvas.__scene__.push(child) * 2

    var numArrays = 4

    child.attr = Object.create(attrDefaults)
    child.tag = el.tagName.toLowerCase()
    child.parentNode = child.parentElement = canvas

    var i = child.indices =
      type.name == 'line' ? [count, count + 1] :
      type.name == 'circle' ? [count * 4] :
      type.name == 'rect' ? [count * 4] :
      []

    i.forEach(function (i) {
      buffer[i] = count + i % 2
    })

    if (type.name !== 'path')
      count += type.name == 'line' ? 2 : 1

    if (type.name == 'line')
      lineCount += 1

    if (type.name == 'circle') {
      pointCount += 1
      fBuffer[pointCount * 4] = 1
    }

    if (type.name == 'rect') {
      pointCount += 1
      fBuffer[pointCount * 4] = 0
    }
    return child
  }
}
window.fb = fBuffer
var e = {}

function event (type, listener) {}

var tween = 'float x(i) { return a / b + b * i }';function drawLoop(elapsed) {
  beforeRender()

  pathgl.uniform('clock', elapsed)

  drawPoints(elapsed)
  drawLines(elapsed)
  drawPolygons(elapsed)

  return stopRendering && beforeRender()
}

var time1 = Date.now()
  , frames = {}

pathgl.frameCounter = frames

function countFrames(elapsed) {
  var dt = elapsed - time1
  frames[dt] = (frames[dt] || (frames[dt] = 0)) + 1
  time1 = elapsed
}


function beforeRender() {
  // countFrames(elapsed)
  gl.clear(gl.COLOR_BUFFER_BIT
           //| gl.DEPTH_BUFFER_BIT
           //| gl.STENCIL_BUFFER_BIT
          )
}

function createTarget( width, height ) {
  var target = {}
  target.framebuffer = gl.createFramebuffer()
  target.renderbuffer = gl.createRenderbuffer()
  target.texture = gl.createTexture()
  // set up framebuffer
  gl.bindTexture(gl.TEXTURE_2D, target.texture)
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST)
  gl.bindFramebuffer(gl.FRAMEBUFFER, target.framebuffer)
  gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, target.texture, 0)
  // set up renderbuffer
  gl.bindRenderbuffer(gl.RENDERBUFFER, target.renderbuffer)
  gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, width, height)
  gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, target.renderbuffer)
  // clean up
  gl.bindTexture(gl.TEXTURE_2D, null )
  gl.bindRenderbuffer(gl.RENDERBUFFER, null )
  gl.bindFramebuffer(gl.FRAMEBUFFER, null)
  return target
}
;var log = console.log.bind(console)

function noop () {}

function extend (a, b) {
  if (arguments.length > 2) [].forEach.call(arguments, function (b) { extend(a, b) })
  else for (var k in b) a[k] = b[k]
  return a
}

function twoEach(list, fn, gl) {
  var l = list.length - 1, i = 0
  while(i < l) fn.call(gl, list[i++], list[i++])
}

function isId(str) {
  return false
}

function each(obj, fn) {
  for (var key in obj) fn(obj[key], key, obj)
}

function hash(str) {
  return str.split("").reduce(function(a,b) { a = ((a << 5) - a) + b.charCodeAt(0); return a & a }, 0)
}

function uniq(ar) { return ar.filter(function (d, i) { return ar.indexOf(d) == i }) }

function push(d) { return this.push(d) }

function flatten(ar) { return ar.reduce(function (a, b) { return a.concat(b.map ? flatten(b) : b) }) }

function clamp (a, x) {
  a = Math.abs(a)
  return x < -a ? -a : x > a ? a : x
}

function range(a, b) {
  return Array(Math.abs(b - a)).join().split(',').map(function (d, i) { return i + a })
}

function powerOfTwo(x) {
  return x && ! (x & (x - 1))
}


function pointInPolygon(x, y, shape) {
}
;  return init(canvas)
} }()