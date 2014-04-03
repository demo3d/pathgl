pathgl.shader = shader

function shader() {
  var dependents = []
    , target = null
    , blockSize
    , stepRate = 2

  var self = {
      read: read
    , scatter: scatter
    , reduce: reduce
    , scan: scan
    , map: map
    , match: matchWith
    , pipe: pipe
    , invalidate: invalidate
  }

  var render = RenderTarget({
    gl: gl
  , mesh: simMesh()
  })

  function step() {
    for(var i = -1; ++i < stepRate;) render.update()
  }

  return self

  function scatter(lambda) {

  }

  function scan(lambda) {

  }

  function reduce(lambda) {

  }

  function read(ctx) {
    dependents.push(ctx)
  }

  function map (shader) {
    render.mergeProgram(simulation_vs, particleShader)
    return this
  }

  function invalidate() {
    tasksOnce.push(step)
    dependents.forEach(function (d) {
      d.invalidate()
    })
  }

  function draw () {
  }

  function matchWith() {
    return this
  }

  function pipe (dest) {
    render.drawTo(dest)
    dest && dest.readFrom(self)
    return self
  }
}

function simMesh() {
  return Mesh(gl, { pos: { array: Quad(), size: 2 }
                  , attrList: ['pos']
                  , count: 4
                  , primitive: 'triangle_strip'
                  })
}