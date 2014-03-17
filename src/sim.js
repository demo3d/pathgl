var simulation_vs = [
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
    , 'gl_FragColor = vec4(1,1,0,1) ;return;'
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
}