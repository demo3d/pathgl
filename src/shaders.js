pathgl.vertexShader = [
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

, 'vec4 unpack_tex(float col) {'
, '    return vec4(mod(col / 1000. / 1000., 1000.),'
, '                mod(col / 1000. , 1000.),'
, '                mod(col, 1000.),'
, '                col);'
, '}'

, 'vec4 tex(vec2 get) { return texture2D(texture0, abs(get)); }'


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
, '    float r = replace_r;'
, '    float x = replace_x;'
, '    float y = replace_y;'
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
, '    gl_FragColor = (v_stroke.x < 0.) ? texture2D(texture0, clipspace(dim.xy) * 2.0) : v_stroke;'
, '}'
].join('\n')

function createProgram(gl, vs_src, fs_src, attributes) {
  var src = vs_src + '\n' + fs_src
  program = gl.createProgram()

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
        //if (keep == data || ! arguments.length) return
        
      if (data.map && data.length > 4)
          gl[method](loc, gl.FALSE, Array.isArray(data) ? data : [data])
        else
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
    , r: '(pos.z < 0.) ? clamp(abs(tex(pos.xy).w) + abs(tex(pos.xy).z) * 4., 2., 10.): (2. * pos.z)'
    , x: '(pos.x < 1.) ? tex(pos.xy).x * resolution.x : pos.x'
    , y: '(pos.y < 1.) ? tex(pos.xy).y * resolution.y : pos.y'
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
  if (type.match('mat')) return 'Matrix' + type[type.length - 1]
  if (type.match('vec')) return type[type.length - 1]
  return 1
}

function mergify(vs1, fs1, subst1) {
  return function (vs2, fs2, subst2) {
    fs2 = fs2 || pathgl.fragmentShader
    vs2 = build_vs(vs2, subst2)
    return createProgram(this.gl, vs2, fs2)
  }
}
