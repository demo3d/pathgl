var c = d3.select(selector)
        .attr(size)
        .call(pathgl)

c.selectAll('rect').data(d3.range(500)).enter().append('rect')
.attr('x', function (d) { return d})
.attr('y', function (d) { return d % 10})
.attr('height', 10)
.attr('width', 10)
.attr('fill', pathgl.texture('obama'))

// navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia

// var video = document.createElement('video')
// video.height = video.width = 300
// video.autoplay = true
// video.loop = true

// navigator.getUserMedia({ video: true }, function(stream) {
//   video.src = window.URL.createObjectURL(stream);
// }, function(error) {})

//videoTexture = pathgl.Texture(video)
