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
  pathgl.kernel(avgShader)
  .read(webcam)
  .matchWith(mosaic)
  .write(texture)

  pathgl.kernel()
  .read(webcam, mosaic)
  .matchWith(avgShader)
  .write(texture)

  pathgl.texture(avgShader)
  .read(webcam)
  .matchWith(mosaic)
}

var textures = pathgl.texture('img')

r = c.selectAll('rect').data(d3.range(col * row )).enter().append('rect')
.attr('x', function (d) { return s/2 + s * (d % col) })
.attr('y', function (d) { return s/2 + s * ~~(d / col) })
.attr('width', s / 2)
.attr('fill', function (d, i) {
      return textures
    })

// d3.timer(function () {
//   r.filter(function (d) { return Math.random() > .9 })
//   .attr('fill', function () { return "hsl(" + Math.random() * 360 + ",100%, 50%)" })
// })

function getVideo () {
  navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia

  var video = document.createElement('video')
  video.height = size.height
  video.height = size.width
  video.autoplay = true
  video.loop = true

  navigator.getUserMedia({ video: true }, function(stream) {
    video.src = window.URL.createObjectURL(stream)
  }, function(error) {})

  //videoTexture = pathgl.texture(video)
  document.body.appendChild(video)
  pathgl.texture('video').repeat()
}
