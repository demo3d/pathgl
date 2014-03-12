! function() {
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
  if (! canvas.getContext) return console.log(canvas, 'is not a valid canvas');function parseColor(v) {
  var a = setStyle(v);
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

}
''
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
;pathgl.vertexShader = [
  'precision mediump float;'

, 'uniform float clock;'
, 'uniform vec2 mouse;'
, 'uniform vec2 resolution;'
, 'uniform vec2 dates;'

, 'attribute vec4 pos;'
, 'attribute vec4 color;'
, 'attribute vec4 fugue;'

, 'varying float type;'
, 'varying vec4 v_stroke;'
, 'varying vec4 v_fill;'
, 'uniform sampler2D texture;'

, 'vec4 unpack_color(float col) {'
, '    return vec4(mod(col / 256. / 256., 256.),'
, '                mod(col / 256. , 256.),'
, '                mod(col, 256.),'
, '                256.)'
, '                / 256.;'
, '}'
, 'void main() {'
, '    float time = clock / 1000.;'

, '    float x = replace_x;'
, '    float y = replace_y;'
// , '    float x = texture2D(texture, pos.xy).x;'
// , '    float y = texture2D(texture, pos.xy).y;'
, '    float fill = color.x;'
, '    float stroke = color.x;'

, '    gl_Position = vec4(2. * (x / resolution.x) - 1., 1. - ((y / resolution.y) * 2.),  1., 1.);'

, '    type = fugue.x;'
, '    gl_PointSize =  replace_r;'
, '    v_fill = unpack_color(fill);'
, '    v_stroke = replace_stroke;'
, '}'
].join('\n\n')

pathgl.fragmentShader = [
  'precision mediump float;'

, 'uniform sampler2D texture;'
, 'uniform vec2 resolution;'
, 'uniform vec2 dates;'

, 'varying float type;'

, 'varying vec4 v_stroke;'
, 'varying vec4 v_fill;'

, 'void main() {'
, '    float dist = distance(gl_PointCoord, vec2(0.5));'
, '    if (type == 1. && dist > 0.5) discard;'
, '    gl_FragColor = (v_stroke.x < 0.) ? texture2D(texture, gl_PointCoord) : v_stroke;'
, '}'
].join('\n')

function createProgram(gl, vs, fs, attributes) {
  program = gl.createProgram()

  vs = compileShader(gl, gl.VERTEX_SHADER, vs)
  fs = compileShader(gl, gl.FRAGMENT_SHADER, fs)

  gl.attachShader(program, vs)
  gl.attachShader(program, fs)

  gl.deleteShader(vs)
  gl.deleteShader(fs)

  ;(attributes || 'pos color fugue'.split(' ')).forEach(function (d, i){
    gl.bindAttribLocation(program, i, d)
  })

  gl.linkProgram(program)
  gl.useProgram(program)
  
  if (! gl.getProgramParameter(program, gl.LINK_STATUS)) throw name + ': ' + gl.getProgramInfoLog(program)

  each({ type: [0]
       , mouse: [0, 0]
       , dates: [0, 0]
       , resolution: [0, 0]
       , clock: [0]
       }, bindUniform.bind(program))

    return program
}

function build_vs(subst) {
  var vertex = pathgl.vertexShader
  each(subst || {}, function (v, k, o) {
    if (k == 'cx') o['x'] = v
    if (k == 'cy') o['y'] = v

  })
    var defaults = extend({
      stroke: '(color.r < 0.) ? vec4(stroke) : unpack_color(stroke)'
    , r: '2. * pos.z'
    , x: 'pos.x'
    , y: 'pos.y'
    }, subst)

  for(var attr in defaults)
    vertex = vertex.replace('replace_'+attr, defaults[attr])

  return vertex
}


function compileShader (gl, type, src) {
  var shader = gl.createShader(type)
  gl.shaderSource(shader, src)
  gl.compileShader(shader)
  if (! gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    var log = (gl.getShaderInfoLog(shader) || '')
      , line = + log.split(':')[2]
    return console.error((src || '').split('\n').slice(line-5, line + 5).join('\n'), log)
  }
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
;var stopRendering = false
var tasks = []

pathgl.stop = function () { stopRendering = true }


function init(c) {
  if (! (gl = initContext(canvas = c)))
    return !! console.log('webGL context could not be initialized')
  program = createProgram(gl, build_vs(), pathgl.fragmentShader)
  canvas.program = program
  monkeyPatch(canvas)
  bindEvents(canvas)
  var main = RenderTarget(canvas)
  tasks.push(main.update)
  gl.clearColor(0,0,0,0)
  startDrawLoop()
  return canvas
}

function flags(gl) {
  gl.disable(gl.SCISSOR_TEST)
  gl.stencilMask(1, 1, 1, 1)
  gl.clear(gl.COLOR_BUFFER_BIT)
  gl.colorMask(true, true, true, true)
  gl.disable(gl.BLEND)
  gl.enable(gl.CULL_FACE)
}

function bindEvents(canvas) {
  setInterval(resizeCanvas, 100)


  function resizeCanvas(v) {
    pathgl.uniform('resolution', [canvas.width || 960, canvas.height || 500])
  }

  canvas.addEventListener('click', clicked)
  canvas.addEventListener('mousemove', mousemoved)
  canvas.addEventListener('touchmove', touchmoved)
  canvas.addEventListener('touchstart', touchmoved)
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
      pAttr: d3_pAttr
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
  , __pos__: []
  , __program__: void 0
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
  this.node().mesh.mergeProgram(attr)

  return this
}

var raf = window.requestAnimationFrame
       || window.webkitRequestAnimationFrame
       || window.mozRequestAnimationFrame
       || function(callback) { window.setTimeout(callback, 1000 / 60) }


var start = Date.now()
function startDrawLoop() {
  tasks.forEach(function (task) { task() })
  pathgl.raf = raf(startDrawLoop)
}

var time1 = Date.now()
  , frames = {}

pathgl.frameCounter = frames

function countFrames(elapsed) {
  var dt = elapsed - time1
  frames[dt] = (frames[dt] || (frames[dt] = 0)) + 1
  time1 = elapsed
}
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
};//cpu intersection tests
//offscreen render color test
;function Mesh (gl, options, attr) {
  var attributes = {}
    , count = attr ? attr.length : 0
    , attrList = options.attrList || ['pos', 'color', 'fugue']
    , primitive = gl[(options.primitive || 'triangle_fan') .toUpperCase()]

  init()
  return {
    init : init
  , free: free
  , plus1: plus1
  , draw: draw
  , bind: bind
  , attributes: attributes
  , set: set
  , addAttr: addAttr
  , removeAttr: removeAttr
  , boundingBox: boundingBox
  }

  function plus1() {
    count += 1
  }

  function init() {
    attrList.forEach(function (name, i) {
      var buffer = gl.createBuffer()
      var option = options[name]  || {}
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
      gl.bufferData(gl.ARRAY_BUFFER, 4 * 1e7, gl.STREAM_DRAW)
      attributes[name] = {
        array: extend(new Float32Array(4e5), attr)
      , buffer: buffer
      , size: option.size  || 4
      , changed: true
      , loc: i
      }
    })
  }

  function free (index) {
    var i, attr
    for(attr in attributes) {
      attr = attributes
      i = attr.size
      while(i--) attributes[index * attr.size + i] = 0
    }
  }

  function bind (obj) {
    obj.posBuffer = attributes.pos.array
    obj.fBuffer = attributes.fugue.array
    obj.colorBuffer = attributes.color.array
    obj.mesh = this
  }

  function draw (offset) {
    if (! count) return
    for (var attr in attributes) {
      attr = attributes[attr]
      gl.bindBuffer(gl.ARRAY_BUFFER, attr.buffer)
      gl.vertexAttribPointer(attr.loc, attr.size, gl.FLOAT, false, 0, 0)
      gl.enableVertexAttribArray(attr.loc)
      if (attr.changed)
        gl.bufferSubData(gl.ARRAY_BUFFER, 0, attr.array)
    }

    gl.drawArrays(primitive, offset || 0, count)
  }
  function set () {}
  function addAttr () {}
  function removeAttr () {}
  function boundingBox() {}
}

function RenderTarget(screen) {
  screen.types = SVGProxy()
  var gl = screen.gl
    , meshes = buildBuffers(gl, screen.types)
    , i = 0
    , fbo = screen.fbo || null
    , prog = screen.program

  var bound_textures = false

  screen.mesh && meshes.push(screen.mesh)

  meshes.forEach(function (d) { d.mergeProgram = mergeProgram })

  if (fbo) initRtt.call(screen)

  return { update: update }

  function mergeProgram(d) {
    prog = createProgram(gl, build_vs(d), pathgl.fragmentShader)
  }

  function update () {
      if (program != prog) gl.useProgram(program = prog)
    gl.bindFramebuffer(gl.FRAMEBUFFER, fbo)
    bindTextures()
    beforeRender(gl)

    pathgl.uniform('clock', new Date - start)

    for(i = -1; ++i < meshes.length;) meshes[i].draw()
  }

  function bindTextures () {
    if ((textures[fbo] || []).length && bound_textures)
      gl.bindTexture(gl.TEXTURE_2D, textures[fbo][0].data),
    bound_textures = true
  }

  function beforeRender(gl) {
    if (!fbo) gl.clear( gl.COLOR_BUFFER_BIT)
    gl.viewport(0, 0, screen.width, screen.height)
  }
}

function buildBuffers(gl, types) {
  var pointMesh = new Mesh(gl, { primitive: 'points' })
  pointMesh.bind(types.circle)
  pointMesh.bind(types.rect)

  var lineMesh = new Mesh(gl, { primitive: 'lines', pos: { size: 2 }})
  lineMesh.bind(types.line)
  return [pointMesh, lineMesh]
}

function initRtt() {
  var width = 512, height = 512

  this.update()

  gl.bindFramebuffer(gl.FRAMEBUFFER, this.fbo)

  this.fbo.width = width
  this.fbo.height = height

  gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.data, 0)

  gl.bindFramebuffer(gl.FRAMEBUFFER, null)
}
;//regexes sourced from sizzle
function querySelectorAll(selector, r) {
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
var chunker =
  /^(\*|\w+)?(?:([\.\#]+[\w\-\.#]+)?)(\[([\w\-]+)(?:([\|\^\$\*\~]?\=)['"]?([ \w\-\/\?\&\=\:\.\(\)\!,@#%<>\{\}\$\*\^]+)["']?)?\])?(:([\w\-]+)(\(['"]?([^()]+)['"]?\))?)?/
;var pointsChanged = true
var pointCount = 0
var lineCount = 0
var linesChanged = true

function SVGProxy () {
  return types.reduce(function (a, type) {
           a[type.name] = constructProxy(type)
           type.prototype = extend(Object.create(proto[type.name]), baseProto)
           return a
         }, {})
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
            this.colorBuffer[this.indices[0]] = v < 0 ? v : parseColor(v)
          }
        , x: function (v){
            this.posBuffer[this.indices[0] + 0] = v
          }
        , y: function (v) {
            this.posBuffer[this.indices[0] + 1] = v
          }
        , width: function (v) {
            this.posBuffer[this.indices[0] + 2] = v
          }
        , height: function (v) {
            this.posBuffer[this.indices[0] + 3] = v
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
              this.colorBuffer[i * 4] = parseInt(fill.toString().slice(1), 16)
            }, this)
          }
        }
, path: { d: buildPath
        , pathLength: noop
        , stroke: function (v) {
            var fill = parseColor(v)
            this.indices.forEach(function (i) {
              this.colorBuffer[i] = + parseInt(fill.toString().slice(1), 16)
            }, this)
          }
        }

, polygon: { points: noop }
, polyline: { points: noop }
, g: { appendChild: function (tag) { this.children.push(appendChild(tag)) },  ctr: function () { this.children = [] } }
, text: { x: noop, y: noop, dx: noop, dy: noop }
}

var baseProto = {
  querySelectorAll: querySelectorAll

, children: Object.freeze([])
, ctr: constructProxy
, querySelector: function (s) { return this.querySelectorAll(s)[0] }
, createElementNS: identity
, insertBefore: noop
, ownerDocument: { createElementNS: function (_, x) { return x} }
, render: function render(node) {
  this.buffer && drawFill(this)
  drawStroke(this)
}
, previousSibling: function () { canvas.scene[canvas.__scene__.indexOf(this) - 1] }
, nextSibling: function () { canvas.scene[canvas.__scene__.indexOf()  + 1] }
, parent: function () { return __scene__ }
, gl: gl

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
}

var types = [
  function circle () {}
, function rect() {}
, function path() {}
, function ellipse() {}
, function line() {}
, function path() {}
, function polygon() {}
, function polyline() {}
, function image() {}
, function text() {}
, function g() {}
]

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
  return (this.types[el.tagName.toLowerCase()] || noop)(el.tagName)
}

function removeChild(el) {
  var i = this.__scene__.indexOf(el)

  el = this.__scene__.splice(i, 1)[0]
  el && el.mesh.free(i)
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
  return function x(tagName) {
    var child = new type()
    extend(child, x)
    var count = canvas.__scene__.push(child)

    var numArrays = 4

    child.mesh.plus1()
    child.attr = Object.create(attrDefaults)
    child.tag = tagName.toLowerCase()
    child.parentNode = child.parentElement = canvas

    var i = child.indices =
      type.name == 'line' ? [count * 2, count * 2 + 1] :
      type.name == 'circle' ? [count * 4] :
      type.name == 'rect' ? [count * 4] :
      []

    if (type.name !== 'path')
      count += type.name == 'line' ? 2 : 1

    if (type.name == 'line')
      lineCount += 2

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

var tween = 'float x(i) { return a / b + b * i }';function noop () {}

function identity(x) { return x }

function push(d) { return this.push(d) }

function powerOfTwo(x) { return x && ! (x & (x - 1)) }

function each(obj, fn) { for (var key in obj) fn(obj[key], key, obj) }

function clamp (x, min, max) { return Math.min(Math.max(x, min), max) }

function Quad () { return [-1.0, -1.0, 1.0, -1.0, -1.0,  1.0, 1.0,  1.0] }

function uniq(ar) { return ar.filter(function (d, i) { return ar.indexOf(d) == i }) }

function flatten(ar) { return ar.reduce(function (a, b) { return a.concat(b.map ? flatten(b) : b) }) }

function range(a, b) {
  return Array(Math.abs(b - a)).join().split(',').map(function (d, i) { return i + a })
}

function isVideoUrl(url) {
  return (url.split('.').pop() || '').join().match(/mp4|ogg|webm/)
}

function hash(str) {
  return str.split("").reduce(function(a,b) { a = ((a << 5) - a) + b.charCodeAt(0); return a & a }, 0)
}

function extend (a, b) {
  if (arguments.length > 2) [].forEach.call(arguments, function (b) { extend(a, b) })
  else for (var k in b) a[k] = b[k]
  return a
}

function pointInPolygon(x, y, shape) {}
;var textures = { null: [] }

//texture data - img,canv,vid, url,
//tetxure target - construct render target
//texture shader - construct render target & add mesh

//shaderTexture
//imageTexture
//renderTexture

pathgl.texture = function (image, options, target) {
  return (image == null ? initRenderTexture :
          isShader(image) ? initShaderTexture :
          initDataTexture)(image, options || {}, target)
}

function initRenderTexture(prog, options) {
  var self = {}
  self.program = prog || program
  self.fbo = gl.createFramebuffer()
  var render = RenderTarget(self)
  self.update = function ( ) {
    options.step && options.step(gl, tex, 0, 100, { x: 500, y: 500, z: 500 })
    render.update()
  }
}

function initShaderTexture (shader, options) {
  return renderTexture()
}

function initDataTexture (image, options, target) {
  if ('string' == typeof image) image = parseImage(image)

  extend(Object.create(Texture), options, {
    image: image
  , width: image.width || 512
  , data: gl.createTexture()
  , height: image.height || 512
  , gl: gl
  })

  ;(textures[target] || (textures[target] = [])).push(self)

  return self.load()
}


var Texture = {
  update: initTexture
, forEach: function () {}
, load: function ()  {
    var image = this.image

    if (image.complete || image.readyState == 4)
      image.addEventListener && image.addEventListener('load', this.update)
    else this.update()

    return this
  }
, unfold: function (attrList) {
    return pathgl.shader()
  }
, repeat: function () {
    setInterval(this.update.bind(this), 15)
  }
, appendChild: function (el) {
    return (this.types[el.toLowerCase()] || noop)(el)
  }
, valueOf: function () {
    return - 1
  }
, querySelectorAll: querySelectorAll
, __scene__: []
, ownerDocument: { createElementNS: function (_, x) { return x } }
}

Texture = extend(Object.create(appendable), Texture)

function updateTexture() {
  gl.bindTexture(gl.TEXTURE_2D, this.data)
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this.image || null)
  gl.bindTexture(gl.TEXTURE_2D, null)
}


function updateTexture(image) {
}

function initTexture(image) {
  gl.bindTexture(gl.TEXTURE_2D, this.data)
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)

  this.image ?
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this.image) :
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 512, 512, 0, gl.RGBA, gl.FLOAT, this.data)

  //if (powerOfTwo(this.width) && powerOfTwo(this.height)) gl.generateMipmap(gl.TEXTURE_2D)
}

function parseImage (image) {
  var query = document.querySelector(image)
  if (query) return query
  return extend(isVideoUrl ? new Image : document.createElement('video'), { src: image })
}

function isShader(str) {
  return str.length > 50
}

function d3_selection_selector(selector) {
  return typeof selector === "function" ? selector :
    function() { return d3_select(selector, this) }
}
;  return init(canvas)
};var simulation_vs = [
  'precision mediump float;'
, 'attribute vec2 pos;'
, '  void main() {'
, '  gl_Position = vec4( pos.xy, 1.0 , 1.0);'
, '  }'
].join('\n')

var forceShader = [
, 'precision mediump float;'
, 'const vec3 TARGET = vec3( 0, 0, 0.01 );'
, 'uniform sampler2D texture;'
, 'uniform vec2 resolution;'
, 'vec4 texelAtOffet( vec2 offset ) { return texture2D( texture, ( gl_FragCoord.xy + offset ) / resolution ); }'
, 'void main() {'
    , 'int slot = int( mod( gl_FragCoord.x, 2.0 ) );'
    , 'if ( slot == 0 ) { '
        , 'vec4 dataA = texelAtOffet( vec2( 0, 0 ) );'
        , 'vec4 dataB = texelAtOffet( vec2( 1, 0 ) );'
        , 'vec3 pos = dataA.xyz;'
        , 'vec3 vel = dataB.xyz;'
        , 'float phase = dataA.w;'
        , 'if ( phase > 0.0 ) {'
            , 'pos += vel * 0.005;'
            , 'if ( length( TARGET - pos ) < 0.035 ) phase = 0.0;'
        , '    else phase += 0.1;'
        , '} else {'
        , '    pos = vec3(-1);'
        , '}'
    , '    gl_FragColor = vec4( pos, phase );'
    , '} else if ( slot == 1 ) { '
        , 'vec4 dataA = texelAtOffet( vec2( -1, 0 ) );'
        , 'vec4 dataB = texelAtOffet( vec2( 0, 0 ) );'
        , 'vec3 pos = dataA.xyz;'
        , 'vec3 vel = dataB.xyz;'
        , 'float phase = dataA.w;'
        , 'if ( phase > 0.0 ) {'
            , 'vec3 delta = normalize( TARGET - pos );'
            , 'vel += delta * 0.05;'
        , '    vel *= 0.991;'
        , '} else {'
        , '    vel = vec3(0);'
        , '}'
    , '    gl_FragColor = vec4( vel, 1.0 );'
, '    }'
, '}'
].join('\n')

pathgl.sim = {}

pathgl.sim.force = function (size) {
  var particleData = new Float32Array( 4 * size * 2)

  var width = size * 2
  var height = size
  var rate = 1000

  return pathgl.texture(forceShader, { step: step , data: particleData })

  function step(gl, tex, unit, count, origin, velocities) {
    velocities = velocities || { x:0, y:0, z:0 }
    //gl.activeTexture( gl.TEXTURE0 + 0)

    gl.bindTexture(gl.TEXTURE_2D, tex)

    var x = ~~(( gl.particleIndex * 2) % width)
    var y = ~~(gl.particleIndex / height)
    var chunks = [{
      x: x,
      y: y,
      size: count * 2
    }]

    function split( chunk ) {
      var boundary = chunk.x + chunk.size;
      if (boundary > width) {
        var delta = boundary - width
        chunk.size -= delta;
        chunk = {
          x: 0,
          y: ( chunk.y + 1 ) % height,
          size: delta
        }
        chunks.push(chunk)
        split(chunk)
      }
    }

    split( chunks[0] )
    var i, j, n, m, chunk, data, force = 1.0;
    for (i = 0, n = chunks.length; i < n; i++) {
      chunk = chunks[i]
      data = []
      for (j = 0, m = chunk.size; j < m; j++) {
        data.push(
          origin.x,
          origin.y,
          origin.z,
          Math.random() * 10,
          velocities.x + force * random(-1.0, 1.0),
          velocities.y + force * random(-1.0, 1.0),
          velocities.z + force * random(-1.0, 1.0),
          0
        )
      }

      gl.texSubImage2D(gl.TEXTURE_2D, 0, chunk.x, chunk.y, chunk.size, 1,
                       gl.RGBA, gl.FLOAT, new Float32Array(data))
    }

    gl.particleIndex += count
    gl.particleIndex %= size
  }
}


function random (min, max) {
  return Math.random() * ( max - min );
} }()