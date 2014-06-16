var simulation_vs = [
  'attribute vec2 pos;'
, '  void main() {'
, '    gl_Position = vec4(pos.xy, 1.0 , 1.0);'
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

       //read last pass
, '    vec4 data = texture2D(texture, (gl_FragCoord.xy) / dimensions) ;'
, '    vec2 pos = data.xy;'
, '    vec2 vel = data.zw;'

       // time should move faster for stuff closer to mouse
, '    float warp =  .01  * (gravity - sqrt(distance(pos, mouse)));'

       //check bounds, contain within screen
, '    if (pos.x > 1.0 || pos.x < 0. || pos.y > 1. || pos.y < -0.) vel *= -1.; '

       //if it hits the origin, reward particle with a boost of energy
, '    if (distance(pos, mouse) < .01) vel *= 1.5; '

       //integrate velocity into position
, '    pos += vel * warp;'

       //decay velocity, send particle to mouse
, '    vel = (vel * .991) + gravity * normalize(mouse - pos) * warp;'

       //write data to next texture
, '    gl_FragColor = vec4(pos, vel) ;'
, '}'
].join('\n')

//size must be a perfect square
var size  = 1e3 * 1e3
  , width = Math.sqrt(size)
  , particleIndex = 0

var texture = pathgl.texture(size)
var shader = pathgl.shader().map(particleShader)

//simple operation
//no dependence between particles
//each particle reads its own data and changes with mouse as a function
texture.pipe(shader)
shader.pipe(texture)

pathgl.uniform('dimensions', [width, width])
pathgl.uniform('gravity', 1)
pathgl.uniform('inertia', 0.001)
pathgl.uniform('drag', 0.991)

texture.seed(size / 1, [1,2].map(Math.random))

d3.select('canvas').selectAll("circle")
.data(texture.unwrap())
.enter().append("circle")
.attr('r', function (d) { return d.z })
.attr('cx', function (d) { return d.x })
.attr('cy', function (d) { return d.y })
.shader({'stroke': 'vec4(tex(pos.xy).x, .2, tex(pos.xy).z' +  ', (10. - r) / 5.0)'})

d3.select('canvas').on('click', function () {
  pathgl.uniform('gravity', pathgl.uniform('gravity') * -1)
})
