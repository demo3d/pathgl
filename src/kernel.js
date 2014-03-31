pathgl.shader = shader

function shader() {
  var dependencies = []
    , target = null
    , blockSize
    , render

  var self = {
      read: read
    , write: write
    , map: map
    , match: matchWith
    , exec: exec
    , pipe: pipe
  }

  return self

  function read(src) {
    dependencies.push(src)
    this.render.__renderTarget__.bind(src)

    return this
  }

  function write() {
    return this
  }

  function map (shader, start) {
    self.render = new RenderTexture(createProgram(gl, simulation_vs, shader, ['pos']), {})
    return this
  }

  function matchWith() {
    return this
  }

  function exec() {
    return this
  }

  function pipe () {}

}
