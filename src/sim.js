var simulation_vs = [
  'precision mediump float;'
, 'attribute vec2 uv;'
, 'attribute vec2 pos;'

, '  varying vec2 vUv;'
, '  void main() {'
, '  vUv = vec2(uv.x, 1.0 - uv.y);'
, '  gl_Position = vec4( pos.xy, 1.0 , 1.0);'
,
, '  }'
].join('\n')


var forceShader = [
  'precision mediump float;'
, '  uniform float opacity;'
, ' uniform sampler2D tPositions;'
, '  uniform sampler2D tOrigins;'
, '  uniform float clock;'
, '  varying vec2 vUv;'
,'  float rand(vec2 co){'
, '      return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);'
, '  }'
, '  void main() {'
, '  vec4 pos = texture2D( tPositions, vUv );'
,'  if ( rand( vUv + clock ) > 0.99 || pos.w <= 0.0 ) {'
,'  pos.xyz = texture2D( tOrigins, vUv ).xyz;'
,'  pos.w = opacity;'
, '  } else {'
, '  if ( pos.w <= 0.0 ) discard;'
, '  float x = pos.x + clock * 5.0;'
,'  float y = pos.y;'
,'  float z = pos.z + clock * 4.0;'
, '  pos.x += sin( y * 0.033 ) * cos( z * 0.037 ) * 0.4;'
, '  pos.y += sin( x * 0.035 ) * cos( x * 0.035 ) * 0.4;'
,'  pos.z += sin( x * 0.037 ) * cos( y * 0.033 ) * 0.4;'
,'  pos.w -= 0.00001;'
,'  }'
, '    gl_FragColor = pos;'
, '  }'
].join('\n')

pathgl.sim = {}

pathgl.sim.force = function () {
 return pathgl.texture(forceShader)
}