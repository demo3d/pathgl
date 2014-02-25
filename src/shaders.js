pathgl.vertexShader = [
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
, '    gl_PointSize =  replace_r;'
, '    v_fill = vec4(unpack_color(fill), 1.);'
, '    v_stroke = replace_stroke;'
, '}'
].join('\n')

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

//type
//1 circle
//2 rect
//3 line
//4 path

function createProgram(vs, fs) {
  program = gl.createProgram()

  console.log(vs)

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

function build_vs(subst) {
  var vertex = pathgl.vertexShader
  each(subst || {}, function (v, k, o) {
    if (k == 'cx') o['x'] = v
    if (k == 'cy') o['y'] = v

  })
  var defaults = extend({
    stroke: '(stroke < 0.) ? vec4(stroke) : vec4(unpack_color(stroke), 1.)'
  , r: '2. * pos.z'
  , x: 'pos.x'
  , y: 'pos.y'
  }, subst)

  for(var attr in defaults)
    vertex = vertex.replace('replace_'+attr, defaults[attr])

  return vertex
}

function initProgram (subst) {
  return createProgram(build_vs(subst), pathgl.fragmentShader)
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

pathgl.shader = function () {}