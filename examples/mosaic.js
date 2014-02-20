var c = d3.select('canvas')
        .attr(size)
        .call(pathgl)

var col = 20
  , s = size.width / col
  , row = size.height / s

r =c.selectAll('rect').data(d3.range(row * col)).enter().append('rect')
.attr('x', function (d) { return s/2 + s * (d % col) })
.attr('y', function (d) { return s/2 + s * ~~(d / col) })
.attr('width', s / 2)
.attr('fill', function () { return "hsl(" + Math.random() * 360 + ",100%, 50%)" })

d3.timer(function () {
  r
  .filter(function (d) { return Math.random() > .9 })
  .attr('fill', function () { return "hsl(" + Math.random() * 360 + ",100%, 50%)" })
})

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
