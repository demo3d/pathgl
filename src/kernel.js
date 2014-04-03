pathgl.shader = shader

function shader() {
  var  target = null
    , blockSize
    , stepRate = 2

  var self = {
    scatter: scatter
    , reduce: reduce
    , scan: scan
    , map: map
    , match: matchWith
    , pipe: pipe
    , invalidate: invalidate
    , dependents: []
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

  function map (shader) {
    render.mergeProgram(simulation_vs, particleShader)
    return this
  }

  function invalidate() {
    tasksOnce.push(step)
    this.dependents.forEach(function (d) {
      d.invalidate()
    })
  }

  function draw () {
  }

  function matchWith() {
    return this
  }

  function pipe (ctx) {
    render.drawTo(ctx)
    ctx && this.dependents.push(ctx)
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