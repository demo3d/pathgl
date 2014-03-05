var start = Date.now()
var tasks = []
function startDrawLoop() {
  tasks.forEach(function (task) {
    task()
  })
  pathgl.raf = raf(startDrawLoop)
}

var time1 = Date.now()
  , frames = {}

pathgl.frameCounter = frames

function countFrames(elapsed) {
  var dt = elapsed - time1
  frames[dt] = (frames[dt] || (frames[dt] = 0)) + 1
  time1 = elapsed
}
