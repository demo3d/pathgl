
var stream = getWebcam()

c = d3.select('canvas').append('circle')
.attr('cx', 50)
.attr('cy', 100)
.attr('r', 50)
.attr('fill', stream)


function getWebcam() {
d3.select('body').append('video')
  navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia

  var video = document.querySelector('video'), tex = pathgl.texture(video)
  navigator.getUserMedia({video:1}, stream, function(error) {})
  function stream(s){video.src=window.URL.createObjectURL(s); tex.repeat() }
  return tex
}