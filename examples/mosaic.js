d3.json('https://api.imgur.com/3/gallery/hot/viral/0.json')
.header("Authorization", 'Client-Id 9e7ab6a35eb2f7a')
.header("Accept", 'application/json')
.get(function (err, data) {
  if (err) throw new Error(err)
  init(data.data
       .filter(function(d) { return ! d.nsfw })
       .map(function (d) { return d.link }))
})

var size = { width: .8 * innerWidth, height: innerHeight * .9 }

var c = d3.select('canvas')
        .attr('height', size.height)
        .attr('width', size.width)

var col = 10
  , s = ~~ (size.width / col)
  , row = ~~ (size.height / s)

var findAverageHue = 'uniform vec2 blockSize;'
                   + 'void main () {'
                   + '  vec3 averageHue = vec3();'
                   + '  for (int i = 0; i < exp2(blockSize.x); i++)'
                   + '    averageHue += texel(vec2(i % blockSize.x, i / blockSize.x));'
                   + '  gl_FragColor = vec4(averageHue / blockSize, 1.0);'
                   + '}'

function init() {
  var mozify = pathgl.shader().matchWith(findAverageHue)
  var webcam = pathgl.texture('video').repeat().pipe(mozify)
  var tiles = pathgl.texture('.tiles').pipe(mozify)
  var mosaic = pathgl.texture()
  return mosaic
}

var webcam = pathgl.texture(getWebcam()).repeat()
r = c.selectAll('rect').data(d3.range(col * row ))
    .enter().append('rect')
    .attr('x', function (d) { return s/2 + s * (d % col) })
    .attr('y', function (d) { return s/2 + s * ~~(d / col) })
    .attr('width', s / 2)
    .attr('fill',  webcam)

function getWebcam() {
  navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia
  var video = d3.select('body').append('video')
              .attr('height', 1000).attr('width', 1000)
              .attr('autoplay', true).attr('loopo', true)
              .node()

  navigator.getUserMedia({ video: true }, function(stream) {
    video.src = window.URL.createObjectURL(stream)
  }, function(error) {})

  return video
}