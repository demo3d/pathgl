var simulation_vs = [
  'precision mediump float;'
, 'attribute vec2 pos;'
, '  void main() {'
, '  gl_Position = vec4(pos.xy, 1.0 , 1.0);'
, '  }'
].join('\n')

var particleShader = [
, 'precision mediump float;'
, 'uniform sampler2D texture;'
, 'uniform vec2 resolution;'
, 'uniform vec2 mouse;'
, 'uniform vec2 dimensions;'
, 'vec4 texelAtOffet(vec2 offset) { '
  + 'return texture2D(texture, (gl_FragCoord.xy + offset) / dimensions); }'
, 'void main() {'
    , 'vec2 TARGET = vec2(mouse / resolution);'
    , 'int slot = int(mod(gl_FragCoord.x, 2.0));'
    , 'if (slot == 0) { '
        , 'vec4 dataA = texelAtOffet(vec2(0, 0));'
        , 'vec4 dataB = texelAtOffet(vec2(1, 0));'
        , 'vec2 pos = dataA.xy;'
        , 'vec2 vel = dataB.xy;'
        , 'float phase = dataA.w;'
            , 'pos += vel * 0.005;'
        , '    phase += 0.1;'
    , '    gl_FragColor = vec4(pos, 1.0, phase);'
    , '} else if (slot == 1) { '
        , 'vec4 dataA = texelAtOffet(vec2(-1, 0));'
        , 'vec4 dataB = texelAtOffet(vec2(0, 0));'
        , 'vec2 pos = dataA.xy;'
        , 'vec2 vel = dataB.xy;'
        , 'float phase = dataA.w;'
            , 'vec2 delta = normalize(TARGET - pos);'
            , 'vel += delta * 0.05;'
        , '    vel *= 0.991;'
    , '    gl_FragColor = vec4(vel, 1.0, 1.0);'
, '    }'
, '}'
].join('\n')

var since = Date.now()
pathgl.sim.particles = function (size) {
  var texture = pathgl.texture(size)

  var k = pathgl.kernel()
          .read(texture)
          .map(particleShader)
          .write(texture)

  var width = Math.sqrt(size) * 2
  var height = Math.sqrt(size)
  var elapsed = 0, cooldown = 16
  var rate = 100
  var particleIndex = 0

  return new ShaderTexture(particleShader, {
    width: width
  , height: height
  , size: size
  , start: start
  , emit: emit
  })

  function start () {
    var now = Date.now() - since
      , origin = [ -1.0 + Math.sin(now * 0.001) * 2.0
                 , -0.2 + Math.cos(now * 0.004) * 0.5
                 , Math.sin(now * 0.015) * -0.05
                 ]

    pathgl.uniform('dimensions', [width, height])
    addParticles(gl = this.gl, texture = this.texture, 40000, origin)
  }

  function emit() {
    if (elapsed - Date.now() > cooldown) return
    elapsed = Date.now()

    var count = rate * Math.random()
      , origin = d3.mouse(this).concat(0)

    addParticles(gl, texture, count, origin)
  }

  function addParticles(gl, tex, count, origin, velocities) {
    velocities = velocities || { x:0, y:0, z:0 }
    gl.activeTexture( gl.TEXTURE0 + tex.unit)
    gl.bindTexture(gl.TEXTURE_2D, tex)

    var x = ~~(( particleIndex * 2) % width)
    var y = ~~(particleIndex / height)
    var chunks = [{ x: x, y: y, size: count * 2 }]

    function split( chunk ) {
      var boundary = chunk.x + chunk.size;
      if (boundary > width) {
        var delta = boundary - width
        chunk.size -= delta;
        chunk = { x: 0, y: ( chunk.y + 1 ) % height, size: delta }
        chunks.push(chunk)
        split(chunk)
      }
    }

    split(chunks[0])
    var i, j, n, m, chunk, data, force = 1.0;
    for (i = 0, n = chunks.length; i < n; i++) {
      chunk = chunks[i]
      data = []
      for (j = 0, m = chunk.size; j < m; j++) {
        data.push(
          origin[0] / -width,
          origin[1] / -height,
          origin[2],
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

    particleIndex += count
    particleIndex %= size
  }
}

function random (min, max) {
  return Math.random() * ( max - min );
}
