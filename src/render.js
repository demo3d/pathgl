
var start = Date.now()
function startDrawLoop() {
  beforeRender()

  pathgl.uniform('clock', new Date - start)

  pointMesh.draw()
  lineMesh.draw()
  //drawPolygons()

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


function beforeRender() {
  // countFrames(elapsed)
  gl.clear(gl.COLOR_BUFFER_BIT
           //| gl.DEPTH_BUFFER_BIT
           //| gl.STENCIL_BUFFER_BIT
          )
}