pathgl.shader = kernel

function kernel () {
  var source = []
    , target = null
    , blockSize
  , render

  var self = {
      read: read
    , write: write
    , map: map
    , match: matchWith
    , exec: exec
  }

  return self

  function read() {
    source = [].slice.call(arguments)
    source.forEach(function (ctx) { ctx.register(self) })
    blockSize = blockSize || source.width
    return this
  }

  function write() {
    return this
  }

  function map (shader, start) {
    self.render = new ShaderTexture(shader, {
      width: source[0].width, height: source[0].height
    , texture: source[0].texture
    })


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
