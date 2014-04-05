! function() {
var pathgl = this.pathgl = {}
pathgl.sim = {}
pathgl.stop = function () {}
pathgl.context = function () { return gl }
var id = (function id (i) { return function () { return i++ }})(1)

var inited = 0
var tasksOnce = []
pathgl.texture = function (image) {
  if (! inited) pathgl.init('canvas')
  return new Texture(image || false)
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

function mock (obj, meth) {
  var save = obj[meth]
  obj[meth] = function () { (obj[meth] = save).call(this, arguments) }
}
;function noop () {}

function identity(x) { return x }

function push(d) { return [].push.call(this, d) }

function powerOfTwo(x) { return x && ! (x & (x - 1)) }

function nextSquare(n) { return Math.pow(Math.ceil(Math.sqrt(n)), 2) }

function each(obj, fn) { for (var key in obj) fn(obj[key], key, obj) }

function clamp (x, min, max) { return Math.min(Math.max(x, min), max) }

function Quad () { return [-1.0, -1.0, 1.0, -1.0, -1.0,  1.0, 1.0,  1.0] }

function isVideoUrl(url) { return url.split('.').pop().join().match(/mp4|ogg|webm/) }

function uniq(ar) { return ar.filter(function (d, i) { return ar.indexOf(d) == i }) }

function flatten(list){ return list.reduce(function( p,n){ return p.concat(n) }, []) }

function svgToClipSpace(pos) { return [2 * (pos[0] / 960) - 1, 1 - (pos[1] / 500 * 2)] }

function append () { [].forEach.call(arguments, push, this) }

function range(a, b) { return Array(Math.abs(b - a)).join().split(',').map(function (d, i) { return i + a }) }

function hash(str) { return str.split("").reduce(function(a,b) { a = ((a << 5) - a) + b.charCodeAt(0); return a & a }, 0) }

function mipmappable() {
  return  powerOfTwo(this.height)
      && powerOfTwo(this.width)
      && (this.data || {}).constructor !== HTMLVideoElement
      && this.data
}

function extend (a, b) {
  if (arguments.length > 2) [].forEach.call(arguments, function (b) { extend(a, b) })
  else for (var k in b) a[k] = b[k]
  return a
}

function onLoad (image, cb) {
  if (! image || image.complete || image.readyState == 4) cb()
  else image.addEventListener && image.addEventListener('load', cb)
}

function pointInPolygon(x, y, shape) {}

var checkerboard = (function() {
  var c = document.createElement('canvas').getContext('2d')
    , s = c.canvas.width = c.canvas.height = 128, y, x
  for (y = 0; y < s; y += 16)
    for (x = 0; x < s; x += 16)
      c.fillStyle = (x ^ y) & 16 ? '#FFF' : '#DDD',
      c.fillRect(x, y, 16, 16)
  return c.canvas
})();function parseColor(v) {
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

  return false
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
;pathgl.shader = shader

function shader() {
  var  target = null
    , blockSize
    , stepRate = 3
    , dependents = []

  var self = {
    scatter: scatter
    , reduce: reduce
    , scan: scan
    , map: map
    , match: matchWith
    , pipe: pipe
    , invalidate: invalidate
  }

  var render = RenderTarget({
    gl: gl
  , mesh: simMesh()
  })

  var children = []

  function step() {
    for(var i = -1; ++i < stepRate;) render.update()
  }

  return self

  function scatter(lambda) {

  }

  function scan(lambda) {

  }

  function reduce(lambda) {

  }

  function map (shader) {
    render.mergeProgram(simulation_vs, particleShader)
    return this
  }

  function read () {
    //render.mesh.addMaterial(texture)
  }

  function invalidate() {
    tasksOnce.push(step)
    dependents.forEach(function (d) {
      d.invalidate()
    })
  }

  function draw () {
  }

  function matchWith(shader) {
    var replace = shader()//takes 64 matched averages and tiles
                  .shared('uv', 'tex1.xy') //varyings
                  .map('gl_fragcolor = texel(uv);') //recolor square
                  .pipe(dependents)

    var search = shader() //takes 2 list of averages
                 .sort('float comparator(vec2 a, vec2 b) { return a > b ? a : b }')
                 .map('bsearch')
                 .pipe(replace)

    var hsl2RGB =
         'void main (){'
         + 'float a = texel(uv);'
          + 'float maxC = max(a.r, a.g, a.b)'
         + 'float minC = min(a.r, a.g, a.b)'
         + 'float lightness = (maxC + minC) * .5'
         + 'float  delta = maxC - minC'
         + 'float saturation = lightness <= 0.5 ? delta / ( maxC + minC ) : delta / ( 2 - maxC - minC )'
         + 'float hue = maxC == a.r ?  (a.g - a.b ) / delta + ( a.g < a.b ? 6 : 0 )'
                   + ': maxC == a.g  ? ( a.b - a.r ) / delta + 2'
                   + ': ( a.r - a.g ) / delta + 4;'
         + 'hue /= 6'
         + 'gl_FragColor = vec3(hue, saturation, threadIdx.xy);'
         + '}'

    dependencies.map(function (d) {
      var averages = shader()
      .blocksize(64, 64)
      .gridsize(8, 8)
      .map(hsl2RGB)
      .reduce(shader) //1024^2 -> 64^2
      .pipe(search)

      d.pipe(averages)
      d[1].pipe(replace)
    })

    //this.children.push(subKernels, matchKernel)
    return this
  }

  function spawnChild () {

  }

  function pipe (ctx) {
    render.drawTo(ctx)
    ctx && dependents.push(ctx)
    return self
  }
}

function simMesh() {
  return Mesh(gl, { pos: { array: Quad(), size: 2 }
                  , attrList: ['pos']
                  , count: 4
                  , primitive: 'triangle_strip'
                  })
};pathgl.vertexShader = [
  'uniform float clock;'
, 'uniform vec2 mouse;'
, 'uniform vec2 resolution;'
, 'uniform vec2 dates;'

, 'attribute vec4 pos;'
, 'attribute vec4 color;'
, 'attribute vec4 fugue;'

, 'varying float type;'
, 'varying vec4 v_stroke;'
, 'varying vec4 v_fill;'
, 'varying vec4 dim;'

, 'uniform sampler2D texture0;'
, 'uniform sampler2D texture1;'
, 'uniform sampler2D texture2;'
, 'uniform sampler2D texture3;'

, 'const mat4 modelViewMatrix = mat4(1.);'
, 'const mat4 projectionMatrix = mat4(1.);'

//which texture? 0-4
//uv coordinates...
//which index or combination of indices?
, 'vec4 unpack_tex(float col) {'
, '    return vec4(mod(col / 1000. / 1000., 1000.),'
, '                mod(col / 1000. , 1000.),'
, '                mod(col, 1000.),'
, '                col);'
, '}'

, 'vec4 texel(vec2 get) { return texture2D(texture0, abs(get)); }'


, 'vec4 unpack_color(float col) {'
, '    return vec4(mod(col / 256. / 256., 256.),'
, '                mod(col / 256. , 256.),'
, '                mod(col, 256.),'
, '                256. - fugue.y)'
, '                / 256.;'
, '}'

, 'vec2 clipspace(vec2 pos) { return vec2(2. * (pos.x / resolution.x) - 1., 1. - ((pos.y / resolution.y) * 2.)); }'
, 'void main() {'
, '    float time = clock / 1000.;'
, '    float x = replace_x;'
, '    float y = replace_y;'
, '    float r = replace_r;'
, '    float fill = color.x;'
, '    float stroke = color.x;'
, '    type = fugue.x;'
, '    gl_PointSize =  r;'
, '    v_fill = unpack_color(fill);'
, '    dim = vec4(x, y, r, -r);'
, '    v_stroke = replace_stroke;'
, '    gl_Position = vec4(clipspace(vec2(x, y)),  1., 1.);'
, '}'
].join('\n\n')

pathgl.fragmentShader = [
  'uniform sampler2D texture0;'
, 'uniform vec2 resolution;'
, 'uniform vec2 dates;'

, 'varying float type;'

, 'varying vec4 v_stroke;'
, 'varying vec4 v_fill;'
, 'varying vec4 dim;'

, 'vec2 clipspace(vec2 pos) { return vec2(2. * (pos.x / resolution.x) - .5, 1. - ((pos.y / resolution.y))); }'
, 'void main() {'
, '    float dist = distance(gl_PointCoord, vec2(0.5));'
, '    if (type == 1. && dist > 0.5) discard;'
, '    gl_FragColor = (v_stroke.x < 0.) ? texture2D(texture0, clipspace(dim.xy + (dim.zw * (gl_PointCoord - .5)))) : v_stroke;'
, '}'
].join('\n')

function createProgram(gl, vs_src, fs_src, attributes) {
  var src = vs_src + '\n' + fs_src
  program = gl.createProgram()
  program.shit = Math.random(0)

  var vs = compileShader(gl, gl.VERTEX_SHADER, vs_src)
    , fs = compileShader(gl, gl.FRAGMENT_SHADER, fs_src)

  gl.attachShader(program, vs)
  gl.attachShader(program, fs)

  gl.deleteShader(vs)
  gl.deleteShader(fs)

  ;(attributes || ['pos', 'color', 'fugue']).forEach(function (d, i){
     gl.bindAttribLocation(program, i, d)
   })

  gl.linkProgram(program)
  gl.useProgram(program)
  if (! gl.getProgramParameter(program, gl.LINK_STATUS)) throw name + ': ' + gl.getProgramInfoLog(program)

  var re = /uniform\s+(\S+)\s+(\S+)\s*;/g, match = null
  while ((match = re.exec(src)) != null) bindUniform(match[2], match[1])

  program.merge = mergify(vs, fs)
  program.gl = gl

  return program

  function bindUniform(key, type) {
    var loc = gl.getUniformLocation(program, key)
      , method = 'uniform' + glslTypedef(type) + 'fv'
      , keep

    program[key] = function (data) {
      if (keep == data || ! arguments.length) return

      gl[method](loc, Array.isArray(data) ? data : [data])
      keep = data
    }
  }
}

function build_vs(src, subst) {
  each(subst || {}, function (v, k, o) {
    if (k == 'cx') o['x'] = v
    if (k == 'cy') o['y'] = v
  })

    var defaults = extend({
      stroke: '(color.r < 0.) ? vec4(stroke) : unpack_color(stroke)'
    , r: '(pos.z < 0.) ? max(texel(pos.xy).w + texel(pos.xy).z, 1.) : (2. * pos.z)'
    , x: '(pos.x < 1.) ? texel(pos.xy).x * resolution.x : pos.x'
    , y: '(pos.y < 1.) ? texel(pos.xy).y * resolution.y : pos.y'
    }, subst)

  for(var attr in defaults)
    src = src.replace('replace_'+attr, defaults[attr])

  return src
}

function compileShader (gl, type, src) {
  var header = 'precision mediump float;\n'
  var shader = gl.createShader(type)
  gl.shaderSource(shader, header + src)
  gl.compileShader(shader)
  if (! gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    var log = (gl.getShaderInfoLog(shader) || '')
      , line = + log.split(':')[2]
    return console.error((src || '').split('\n').slice(line-5, line + 5).join('\n'), log)
  }
  return shader
}

function glslTypedef(type) {
  if (type.match('vec')) return type[type.length - 1]
  return 1
}

function mergify(vs1, fs1, subst1) {
  return function (vs2, fs2, subst2) {
    fs2 = fs2 || pathgl.fragmentShader
    vs2 = build_vs(vs2, subst2)
    return createProgram(this.gl, vs2, fs2)
  }
};function init(c) {
  if (! (gl = initContext(canvas = c)))
    return !! console.log('webGL context could not be initialized')

  if (! gl.getExtension('OES_texture_float'))
    console.warn('does not support floating point textures')

  program = createProgram(gl, build_vs(pathgl.vertexShader), pathgl.fragmentShader)
  canvas.program = program
  monkeyPatch(canvas)
  bindEvents(canvas)
  var main = RenderTarget(canvas)
  main.drawTo(null)
  tasks.push(main.update)
  gl.clearColor(.3, .3, .3, 1.)
  flags(gl)
  startDrawLoop()
  tasks.push(function () {
    pathgl.uniform('clock', new Date - start)
  })
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
  this.node().mesh.mergeProgram(pathgl.vertexShader, pathgl.fragmentShader, attr)
  return this
}

var raf = window.requestAnimationFrame
       || window.webkitRequestAnimationFrame
       || window.mozRequestAnimationFrame
       || function(callback) { window.setTimeout(callback, 1000 / 60) }

var backTasks = []
function startDrawLoop() {
  var i = tasks.length, swap
  while(i--) tasks[i]()

  swap = tasksOnce
  tasksOnce = [] //backTasks
  backTasks = swap
  while(backTasks.length) backTasks.pop()()
  raf(startDrawLoop)
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

function applyCSSRules () {
  if (! d3) return console.warn('this method depends on d3')
  d3.selectAll('link[rel=styleSheet]').each(function () {
    d3.text
  })

  var k = d3.selectAll('style')[0].map(function () { return this.sheet })
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

var pickings  = {}

function addEvenLtistener (evt, listener, capture) {
  //oaaa
  (pickings[this.attr.cx] = (pickings[this.attr.cx] || {}))
  [this.attr.cy] = this
  this.mouseover = listener
};function Mesh (gl, options, attr) {
  var attributes = {}
    , count = options.count || 0
    , attrList = options.attrList || ['pos', 'color', 'fugue']
    , primitive = gl[options.primitive.toUpperCase()]
    , material = []

  init()
  return {
    init : init
  , free: free
  , alloc: alloc
  , draw: draw
  , bind: bind
  , bindMaterial: bindMaterial
  , attributes: attributes
  , set: set
  , addAttr: addAttr
  , removeAttr: removeAttr
  , boundingBox: boundingBox
  }

  function alloc() {
    return count += options.primitive == 'points' ? 1
                  : options.primitive == 'lines' ? 2
                  : 3
  }

  function init() {
    attrList.forEach(function (name, i) {
      var buffer = gl.createBuffer()
      var option = options[name]  || {}
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
      gl.bufferData(gl.ARRAY_BUFFER, 4 * 1e7, gl.STREAM_DRAW)
      attributes[name] = {
        array: new Float32Array(options[name] && options[name].array || 4e5)
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
    //bindMaterial()

    gl.drawArrays(primitive, offset || 0, count)
  }

  function set () {}
  function addAttr () {}
  function removeAttr () {}
  function boundingBox() {}

  function bindMaterial(attr, tex) {
    if (!~ material.indexOf(tex))
      material.push(tex)
    //mapping
  }
}

function RenderTarget(screen) {
  var gl = screen.gl
    , targets = []
    , prog = screen.program || program
    , types = screen.types = SVGProxy()
    , meshes = screen.mesh ? [screen.mesh] : buildBuffers(gl, screen.types)

  meshes.forEach(function (d) { d.mergeProgram = mergeProgram })

  return screen.__renderTarget__ = {
    update: update
  , append: append
  , drawTo: drawTo
  , mergeProgram: mergeProgram
  }

  function drawTo(texture) {
    if (! texture) return targets.push(null)
    targets.push(initFbo(texture))
    screen.width = texture.width
    screen.height = texture.height
  }

  function append(el) {
    return (types[el.toLowerCase()] || console.log.bind(console, 'oops'))(el)
  }

  function mergeProgram(vs, fs, subst) {
    prog = prog.merge(vs, fs, subst)
  }

  function update () {
    if (program != prog) gl.useProgram(program = prog)
    for(var i = -1; ++i < targets.length;) {
      gl.bindFramebuffer(gl.FRAMEBUFFER, targets[i])
      setUniforms()
      beforeRender(gl, screen)
      for(var j = -1; ++j < meshes.length;) meshes[j].draw()
    }
  }

  function setUniforms () {
    for (var k in uniforms)
      program[k] && program[k](uniforms[k])
  }

  function beforeRender(gl, screen) {
    if (screen == gl.canvas) gl.clear(gl.COLOR_BUFFER_BIT)
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


function initFbo(texture) {
  var fbo = gl.createFramebuffer()
  gl.bindFramebuffer(gl.FRAMEBUFFER, fbo)
  fbo.width = texture.width
  fbo.height = texture.height
  gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture.texture, null)
  gl.bindFramebuffer(gl.FRAMEBUFFER, null)
  return fbo

};//regexes sourced from sizzle
function querySelector(s) { return this.querySelectorAll(s)[0] }
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
      || attribute && !checkAttr(attrCmp, this.attr[attr] || '', attrVal)
      || classId && (m = classId.match(/#([\w\-]+)/)) && m[1] !== this.attr.id
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
function matchClass(d) { return ! RegExp('(^|\\s+)' + d.slice(1) + '(\\s+|$)').test(this.attr.class) }
function byTagName(name) { return traverse(this, function (doc) { return name == '*' || doc.tagName == name }, []) }
function traverse(node, fn, val) {
  return (node.__scene__ || node.children).forEach(function (node) { traverse(node, fn, val), fn(node) && val.push(node) }) || val }

var pseudos = {} //todo

var combinators = { ' ': function (d) { return d && d !== __scene__ && d.parent() }
                  , '>': function (d, maybe) { return d && d.parent() == maybe.parent() && d.parent() }
                  , '~': function (d) { return d && d.previousSibling() }
                  , '+': function (d, ct, p1, p2) { return ! d || ((p1 = previous(d)) && (p2 = previous(ct)) && p1 == p2 && p1) }
                  }
var chunker =
  /^(\*|\w+)?(?:([\.\#]+[\w\-\.#]+)?)(\[([\w\-]+)(?:([\|\^\$\*\~]?\=)['"]?([ \w\-\/\?\&\=\:\.\(\)\!,@#%<>\{\}\$\*\^]+)["']?)?\])?(:([\w\-]+)(\(['"]?([^()]+)['"]?\))?)?/
;function SVGProxy () {
  return types.reduce(function (a, type) {
           a[type.name] = function x() {
             var self = Object.create(type.prototype)
             extend(self, x)
             self.init(x.mesh.alloc() - 1)
             self.attr = {}
             return self
           }
           extend(type.prototype, baseProto, proto[type.name])
           return a
         }, {})
}

var proto = {
  circle: { init: function (i) {
              this.fBuffer[i * 4] = 1
              this.indices = [i * 4]
            }
          , cx: function (v) {
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
            tagName: 'circle'
          , schema: 'cx cy r cz'.split(' ')
          }


, ellipse: { init: function () {},
             tagName: 'ellipse'
           , cx: noop, cy: noop, rx: noop, ry: noop }
, rect: { init: function (i) {
            this.fBuffer[i * 4] = 0
            this.indices = [i * 4]
          }, tagName: 'rect'
        , fill: function (v) {
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
, image: { init: function () {


           }, tagName: 'image'
         , 'xlink:href': noop, height: noop, width: noop, x: noop, y: noop }

, line: { init: function (i) {
            this.indices = [i * 2, i * 2 + 1]
          }, tagName: 'line'
        , x1: function (v) { this.posBuffer[this.indices[0] * 2] = v }
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
, path: { init: function () {


          }, tagName: 'path'
        , d: buildPath
        , pathLength: noop
        , stroke: function (v) {
            var fill = parseColor(v)
            this.indices.forEach(function (i) {
              this.colorBuffer[i] = + parseInt(fill.toString().slice(1), 16)
            }, this)
          }
        }

, polygon: { init: function () {
             }, tagName: 'polygon'
           , points: noop }
, polyline: { init: function (i) {
                this.indices = [i * 2, i * 2 + 1]
              }, tagName: 'polyline'
          , points: noop }
, g: { init: function () {

       }, tagName: 'g'
     , appendChild: function (tag) { this.children.push(appendChild(tag)) },  ctr: function () { this.children = [] } }
, text: { init: function () {

          }, tagName: 'text'
        , x: noop, y: noop, dx: noop, dy: noop }
}

var baseProto = {
  gl: gl
, children: Object.freeze([])
, querySelector: querySelector
, querySelectorAll: querySelectorAll
, createElementNS: identity
, insertBefore: noop
, ownerDocument: { createElementNS: function (_, x) { debugger ;return x } }
, previousSibling: function () { canvas.scene[canvas.__scene__.indexOf(this) - 1] }
, nextSibling: function () { canvas.scene[canvas.__scene__.indexOf()  + 1] }
, parent: function () { return __scene__ }
, opacity: function (v) {
    this.fBuffer[this.indices[0] + 1] = 256 - (v * 256)
  }
, transform: function (d) {}
, getAttribute: function (name) {
    return this.attr[name]
  }
, setAttribute: function (name, value) {
    this.attr[name] = value
    this[name] && this[name](value)
    if (value && value.texture) this.mesh.bindMaterial(name, value)
  }
, removeAttribute: function (name) {
    delete this.attr[name]
  }
, textContent: noop
, removeEventListener: noop
, addEventListener: addEventListener
, style: { setProperty: noop }
, ownerSVGElement: { createSVGPoint: noop }
}

var types = [
  function circle () {}
, function rect() {}
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
  return this.__scene__[this.__scene__.length] = this.__renderTarget__.append(el.tagName)
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
;function Texture(image) {
  this.width = image.width || 512
  this.height = image.height || 512

  if ('string' == typeof image) image = parseImage(image)
  if ('number' == typeof image) this.width = this.height = Math.sqrt(image), image = false

  extend(this, {
    gl: gl
  , id: id()
  , data: image
  , dependents: []
  , texture: gl.createTexture()
  , invalidate: function () {
      tasksOnce.push(function () { this.forEach(function (d) { d.invalidate() }) }.bind(this.dependents))
    }
  })

  if (Array.isArray(image)) this.data = batchTexture.call(this)
  if (image.constructor == Object) image = parseJSON(image)
  loadTexture.call(this)
}

Texture.prototype = {
  update: function (data) {
    this.data ?
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, data || this.data) :
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, this.width, this.height, 0, gl.RGBA, gl.FLOAT, null)
  }
, size: function (w, h) {
    if (! arguments.length) return this.width * this.height
    this.width = w
    this.height = h || w
    return this
  }
, z: function () {
    var sq = Math.sqrt(this.size())
    return function (d, i) { return -1.0 / sq * ~~ (i % sq) }
  }
, x: function () {
    var sq = Math.sqrt(this.size())
    return function (d, i) { return -1.0 / sq * ~~ (i % sq) }
  }
, y: function () {
    var sq = Math.sqrt(this.size())
    return function (d, i) { return -1.0 / sq * ~~ (i / sq) }
  }
, subImage: function (x, y, data) {
    gl.bindTexture(gl.TEXTURE_2D, this.texture)
    gl.texSubImage2D(gl.TEXTURE_2D, 0, x, y, data.length / 4, 1, gl.RGBA, gl.FLOAT, new Float32Array(data))
  }

, repeat: function () {
    this.task = function () { this.update() }.bind(this)
    tasks.push(this.task)
    return this
  }

, stop : function () {
    this.task && tasks.splice(tasks.indexOf(this.task))
    delete this.task
  }

, appendChild: function (el) {
    if (! this.__renderTarget__) renderable.call(this)
    return this.__scene__[this.__scene__.length] = this.__renderTarget__.append(el.tagName || el)
  }

, valueOf: function () {
    return - this.id
  }

, copy: function () { return pathgl.texture(this.src) }
, pipe: pipeTexture
, querySelector: querySelector
, querySelectorAll: querySelectorAll
, ownerDocument: { createElementNS: function (_, x) { return x } }
, unwrap: unwrap
, adnan: true
}

function initTexture() {
  var mipmap = mipmappable.call(this)
    , wrap = gl[mipmap ? 'REPEAT' : 'CLAMP_TO_EDGE']
    , filter = gl[mipmap ? 'LINEAR' : 'NEAREST']

  gl.bindTexture(gl.TEXTURE_2D, this.texture)
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, filter)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, filter)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, wrap)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, wrap)
  //if (this.height == this.width && mipmap) gl.generateMipmap(gl.TEXTURE_2D)
  this.update()
}

function parseImage(image) {
  try {
    var query = document.querySelector(image)
    if (query) return query
  } catch (e) {}

  return extend(isVideoUrl ? new Image : document.createElement('video'), { crossOrigin: 'anonymous', src: image})
}

function pipeTexture(ctx) {
  this.dependents.push(ctx)
  return this
}

function readFrom(ctx) {
  this.dependents.push(ctx)
}

function unwrap() {
  var i = this.size() || 0, uv = new Array(i)
  while(i--) uv[i] = { x: this.x()(i, i), y: this.y()(i, i), z: this.z()(i, i) }
  return uv
}

function renderable() {
  extend(this, { __scene__: [] })
  (this.__renderTarget__ = RenderTarget(this))
  .drawTo(this)
  var save  = this.update
  this.update = function () {
    save.call(this)
    this.__renderTarget__.update()
  }
}

function batchTexture () {
  var data = this.data
    , rows = data.rows
    , size = data.width
    , update = this.update.bind(this)
    , c = document.createElement('canvas').getContext('2d')
    , tile = size / rows
    , count = 0

  c.canvas.width = c.canvas.height = size
  data.forEach(function (d, i) {
    var img = parseImage(data[i]),
        sx = tile * (i % rows),
        sy = tile * ~~(i / rows)

    onLoad(img, function () {
      c.drawImage(img, sx, sy, tile, tile)
      update()
    })
  }, this)

  return c.canvas
}

function readFrom(ctx) {
  this.dependents.push(ctx)
}

function parseJSON(json) {
  var buff = new Float32Array(1024), row = 0, count = 0
  for(var key in json) {
    for(var pixel in json[key])
      buff[count++] = json[key][pixel]

    if (count > 1020) this.subImage(0, count, buff)
                    , buff = new Float32Array(1024)
  }
}




function loadTexture()  {
  var image = this.data

  initTexture.call(this)
  this.update(checkerboard)

  onLoad(image, this.update.bind(this))

  return this
};;var simulation_vs = [
  'attribute vec2 pos;'
, '  void main() {'
, '  gl_Position = vec4(pos.xy, 1.0 , 1.0);'
, '  }'
].join('\n')

var particleShader = [
  'uniform sampler2D texture;'
, 'uniform vec2 resolution;'
, 'uniform vec2 mouse;'
, 'uniform vec2 dimensions;'
, 'uniform float gravity;'
, 'uniform float inertia;'
, 'uniform float drag;'
, 'uniform float clock;'
, 'void main() {'
    , 'vec2 TARGET = vec2(mouse / resolution);'
        , 'vec4 data = texture2D(texture, (gl_FragCoord.xy) / dimensions);'
        , 'vec2 pos = data.xy;'
        , 'vec2 vel = data.zw;'
        , 'if (pos.x > 1.) { vel.x *= -1.; pos.x = 1.; } '
        , 'if (pos.y > 1.) { vel.y *= -1.; pos.y = 1.; } '
        , 'if (pos.x < 0.) { vel.x *= -1.; pos.x = 0.; } '
        , 'if (pos.y < 0.) { vel.y *= -1.; pos.y = 0.; } '
        , 'pos += inertia  * vel;'
        , 'vel += gravity * normalize(TARGET - pos);'
        , 'vel *= drag;'
        , 'gl_FragColor = vec4(pos, vel);'
     , '}'
].join('\n')

var since = Date.now()
pathgl.sim.particles = function (s) {
  var size  = nextSquare(s)
    , width = Math.sqrt(size)
    , height = width
    , particleIndex = 0

  var texture = pathgl.texture(size)
  var shader = pathgl.shader().map(particleShader)

  texture.pipe(shader)
  shader.pipe(texture)
  //shader.pipe(null)
  shader.invalidate()
  setTimeout(start, 1000)

  return extend(texture, { emit: emit, reverse: reversePolarity })

  function reversePolarity () {
    pathgl.uniform('gravity', pathgl.uniform('gravity') * -1)
  }

  function start () {
    pathgl.uniform('dimensions', [width, height])
    pathgl.uniform('gravity', .1)
    pathgl.uniform('inertia', 0.005)
    pathgl.uniform('drag', 0.991)
    for(var i = -1; ++i < 10;)
      addParticles(size / 10, [1,2].map(Math.random))
  }

  function emit(origin, ammount) {
    addParticles(ammount || size * Math.random(), origin || [0,0])
  }

  function addParticles(count, origin) {
    var x = ~~(particleIndex % width)
      , y = ~~(particleIndex / height)
      , chunks = [{ x: x, y: y, size: count }]

    ;(function recur(chunk) {
      var boundary = chunk.x + chunk.size
        , delta = boundary - width
      if (boundary < width) return
      chunk.size -= delta
      chunks.push(chunk = { x: 0, y:(chunk.y + 1) % height, size: delta })
      recur(chunk)
    })(chunks[0])

    chunks.forEach(function (chunk) {
      var data = [], j = -1
      while(++j < chunk.size)
        data.push(origin[0], origin[1], random(-1.0, 1.0), random(-1.0, 1.0))

      texture.subImage(chunk.x, chunk.y, data)
    })

    particleIndex += count
    particleIndex %= size
  }
}

function random(min, max) {
  return Math.random() * (max - min)
}
 }()