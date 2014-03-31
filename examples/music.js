d3.select('.blurb')
.append('a')
.attr('href', '#')
.text('click to play Overture by Beats Antique')
.on('click', play)

var size = { width: 960, height: 500 }

var Audio = window.AudioContext || window.webkitAudioContext
  , numLines = 2e3
  , midX = size.width / 2
  , midY = size.height / 2
  , analyzer
  , promise

var audio = d3.select('.right').append('audio')
            .attr('src', 'data/overture.mp3')
            .attr('preload', 'auto')
            .attr('loop', true)

var node = audio.on('loadeddata', function () { promise = true}).node()

function play () {
  var s = d3.select('canvas')

  var scale = Math.PI * 2 / numLines

  promise ? initAudio.call(audio.node()) : audio.on('loadeddata', initAudio)

  var lines = s.selectAll('line').data(d3.range(numLines).map(function () { return {a: 0}}))
              .enter()
              .append('line')
              .attr({
                x1: midX
              , y1: midY
              , stroke: function () { return "hsl(" + Math.random() * 360 + ",100%, 50%)" }
              , x2: function (d, i) { return Math.cos(i * 2) * 300 }
              , y2: function (d, i) { return Math.sin(i * 2) * 300 }
              })

  d3.timer(function () {
    if (! analyzer) return
    freqData = new Uint8Array(analyzer.fftSize)
    timeData = new Uint8Array(analyzer.fftSize)

    analyzer.getByteTimeDomainData(timeData)
    analyzer.getByteFrequencyData(freqData)
    var min = d3.min(timeData)

    var dMax = 0
    lines.each(function (d, i) {
      var freq  = freqData[i % 1024] * 3
      if(dMax < (d.diff = d.v - freq)) dMax = d.diff
      d.v = freq
      d.a = freq + d.diff
    })
    .attr('stroke', function (d) { return "hsl(" + Math.abs(d.diff / dMax * 10 + 240) + ",100%, 50%)" })
    .attr('x2', function (d, i) { return midX + (Math.cos(i) * d.a) })
    .attr('y2', function (d, i) { return midY + (Math.sin(i) * d.a)})
    d3.select('canvas').node().gl.lineWidth(2)
  })
  d3.select('.play').on('click', null)
}


function sort (a) {
  return [].sort.call(a, function (a, b) {
           return b - a
         })
}

function initAudio() {
  var audioContext = new Audio();
  window.analyzer = audioContext.createAnalyser();
  var source = audioContext.createMediaElementSource(this);
  source.connect(analyzer);
  analyzer.connect(audioContext.destination);
  this.play()
  this.currentTime = 83
  this.volume = .1
  this.playbackRate = 1
}

function initDnD (arrayBuffer) {
  window.audioCtx = new Audio()
  window.analyser = audioCtx.createAnalyser()

  if (window.source)
    source.noteOff(0)

  if (window.source)
    audio.stop()
  audioCtx.decodeAudioData(arrayBuffer, function(buffer) {

    window.source = audioCtx.createBufferSource()
    source.buffer = buffer

    source.connect(analyser)

    analyser.connect(audioCtx.destination)

    source.start(0)
    analyzer = analyser
  })
}
