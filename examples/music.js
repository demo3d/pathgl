var analyzer

var numLines = 2048
var s = d3.select('canvas')
        .attr(size)
        .call(pathgl)

var scale = Math.PI * 2 / numLines

var midX = size.width / 2
var midY = size.height / 2


var audio = d3.select('.right').append('audio')
            .attr('src', 'data/overture.mp3')

var node = audio.on('play', initAudio).node()
node.play()

var lines = s.selectAll('line').data(d3.range(numLines).map(function () { return {a: 0}}))
            .enter()
            .append('line')
            .attr({
              x1: size.width >> 1
            , y1: size.height >> 1
            , stroke: function () { return "hsl(" + Math.random() * 360 + ",100%, 50%)" }
            , x2: function (d, i) { return Math.cos(i * 2) * 300 }
            , y2: function (d, i) { return Math.sin(i * 2) * 300 }
            })
//"hsl(" + Math.random() * 360 + ",100%, 50%)"

d3.timer(function () {
  if (! analyzer) return
  var freqData = new Uint8Array(analyzer.frequencyBinCount)
  var timeData = new Uint8Array(analyzer.frequencyBinCount)

  analyzer.getByteTimeDomainData(timeData)
  analyzer.getByteFrequencyData(freqData)
  lines.each(function (d, i) {
    var freq  = (i > 1024 ? freqData : timeData)[i % 1024]
    d.diff = d.a - freq
    d.a = freq
  })
  .attr('stroke', function (d) { return "hsl(" + Math.abs(d.diff * 10 + 200) + ",100%, 50%)" })
  .attr('x2', function (d, i) { return midX + (Math.cos(i) * d.a) })
  .attr('y2', function (d, i) { return midY + (Math.sin(i) * d.a)})

  //s.node().style.background = "hsl(" + d3.sum(byteFreq) * 5 + ",100%, 50%)"
})

dropAndLoad(document.querySelector('.right'), initDnD, "ArrayBuffer")

function initAudio() {
  var audioContext = new webkitAudioContext();
  window.analyzer = audioContext.createAnalyser();
  var source = audioContext.createMediaElementSource(this);
  source.connect(analyzer);
  analyzer.connect(audioContext.destination);
  this.play();
}

function initDnD (arrayBuffer) {
  window.audioCtx = new webkitAudioContext()
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

function dropAndLoad(dropElement, callback, readFormat) {
  var readFormat = readFormat || "DataUrl"

  dropElement.addEventListener('dragover', function(e) {
    e.stopPropagation()
    e.preventDefault()
    e.dataTransfer.dropEffect = 'copy'
  }, false)

  dropElement.addEventListener('drop', function(e) {
    e.stopPropagation()
    e.preventDefault()
    loadFile(e.dataTransfer.files[0])
  }, false)

  function loadFile(files) {
    var file = files
    var reader = new FileReader()
    reader.onload = function(e) {
      callback(e.target.result)
    }
    reader['readAs'+readFormat](file)
  }
}
