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
, 'uniform float gravity;'
, 'uniform float inertia;'
, 'uniform float drag;'
, 'void main() {'
    , 'vec2 TARGET = vec2(mouse / resolution);'
        , 'vec4 data = texture2D(texture, (gl_FragCoord.xy) / dimensions);'
        , 'vec2 pos = data.xy;'
        , 'vec2 vel = data.zw;'
        , 'if (pos.x > 1.) { vel.x *= -1.; pos.x = 1.; } '
        , 'if (pos.y > 1.) { vel.y *= -1.; pos.y = 1.; } '
        , 'if (pos.x < 0.) { vel.x *= -1.; pos.x = 0.; } '
        , 'if (pos.y < 0.) { vel.y *= -1.; pos.y = 0.; } '
        , 'pos += vel * inertia;'
        , 'vel += gravity * normalize(TARGET - pos) * 0.05;'
        , 'vel *= drag;'
        , 'gl_FragColor = vec4(pos, vel);'
     , '}'
].join('\n')

var since = Date.now()
pathgl.sim.particles = function (size) {
  size = nextSquare(size)

  var texture = pathgl.texture(size)

  var k = pathgl.kernel()
          .read(texture)
          .map(particleShader)
          .write(texture)

  var width = Math.sqrt(size)
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
  , reverse: reversePolarity
  })

  function reversePolarity () {
   pathgl.uniform('gravity', pathgl.uniform('gravity') * -1)
  }

  function start () {
    pathgl.uniform('dimensions', [width, height])
    pathgl.uniform('gravity', 1)
    pathgl.uniform('inertia', 0.005)
    pathgl.uniform('drag', 0.991)
    addParticles(gl = this.gl, texture = this.texture, size / 2, [1,2].map(Math.random))
    addParticles(gl = this.gl, texture = this.texture, size, [1,2].map(Math.random))

  }

  function emit() {
    addParticles(gl, texture, rate * Math.random(), [0,0])
  }

  function addParticles(gl, tex, count, origin, velocities) {
    velocities = velocities || { x:0, y:0 }
    gl.activeTexture( gl.TEXTURE0 + tex.unit)
    gl.bindTexture(gl.TEXTURE_2D, tex)

    var x = ~~(( particleIndex) % width)
    var y = ~~(particleIndex / height)
    var chunks = [{ x: x, y: y, size: count }]

    ;(function split( chunk ) {
      var boundary = chunk.x + chunk.size;
      if (boundary > width) {
        var delta = boundary - width
        chunk.size -= delta;
        chunk = { x: 0, y: ( chunk.y + 1 ) % height, size: delta }
        chunks.push(chunk)
        split(chunk)
      }
    })(chunks[0])

    var i, j, chunk, data, force = 1.0;
    for (i = 0; i < chunks.length; i++) {
      chunk = chunks[i]
      data = []
      for (j = 0; j < chunk.size; j++) {
        data.push(origin[0], origin[1],
                  velocities.x + force * random(-1.0, 1.0),
                  velocities.y + force * random(-1.0, 1.0)
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
