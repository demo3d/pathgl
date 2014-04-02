d3.json('https://api.imgur.com/3/gallery/hot/viral/0.json')
.header("Authorization", 'Client-Id 9e7ab6a35eb2f7a')
.header("Accept", 'application/json')
.get(function (err, data) {
  //if (! err) pathgl.texture(data.map(function (d) { return d.link }))
})

var size = { width: .8 * innerWidth, height: innerHeight * .9}

var c = d3.select('canvas')
        .attr('height', size.height)
        .attr('width', size.width)

var col = 20
  , s = size.width / col
  , row = Math.round(size.height / s)

function launch() {
  var mozify = pathgl.shader()
               .blockSize(50)
               .matchWith(avgShader)
               .pipe(mosaic)

  var webcam = pathgl.texture('.video').repeat().pipe(mozify)
  var tiles = pathgl.texture('.tiles').pipe(mozify)
  var mosaic = pathgl.texture()
  return mosaic
}

//var textures = [].map.call(document.querySelectorAll('img'), pathgl.texture)
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
