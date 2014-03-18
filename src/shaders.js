pathgl.vertexShader = [
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

, 'const mat4 modelViewMatrix = mat4(1.);'
, 'const mat4 projectionMatrix = mat4(1.);'

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
 //, '    float x = texture2D(texture, pos.xy).x;'
//, '    float y = texture2D(texture, pos.xy).y;'
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

  ;(attributes || ['pos', 'color', 'fugue']).forEach(function (d, i){
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
    , x: '(pos.x < 0.) ? texture2D(texture, abs(pos.xy)).x * resolution.x: pos.x'
    , y: '(pos.y < 0.) ? texture2D(texture, abs(pos.xy)).y * resolution.y: pos.y'
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
