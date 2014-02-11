var c = d3.select('canvas')
        .attr(size)
        .call(pathgl)

var col = 20
var s = size.width / col
var row = size.height / s

c.selectAll('rect').data(d3.range(row * col)).enter().append('circle')
.attr('cx', function (d) { return s/2 + s * (d % col) })
.attr('cy', function (d) { return s/2 + s * ~~(d / col) })
.attr('r', s / 2)
.attr('fill', 'pink')

function getVideo () {
  navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia

  var video = document.createElement('video')
  video.height = size.height
  video.height = size.width
  video.autoplay = true
  video.loop = true

  navigator.getUserMedia({ video: true }, function(stream) {
    video.src = window.URL.createObjectURL(stream);
  }, function(error) {})

  videoTexture = pathgl.texture(video)
  document.body.appendChild(video)
}
