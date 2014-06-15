function Texture(image) {
  this.width = image.width || 512
  this.height = image.height || 512

  if ('string' == typeof image) image = parseImage(image)
  if ('number' == typeof image) this.width = this.height = Math.sqrt(image), image = false

  extend(this, {
    gl: gl
  , id: id()
  , data: image
  , dependents: []
  , texture: gl.createTexture()
  , invalidate: function () {
      tasksOnce.push(function () { this.forEach(function (d) { d.invalidate() }) }.bind(this.dependents))
    }
  })

  if (Array.isArray(image)) this.data = null, chunkIt.call(this, image)

  //if (Array.isArray(image)) this.data = batchTexture.call(this)
  if (image.constructor == Object) image = parseJSON(image)
  loadTexture.call(this)
}

Texture.prototype = {
  update: function (data) {
    this.data ?
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, data || this.data) :
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, this.width, this.height, 0, gl.RGBA, gl.FLOAT, null)
  }
, size: function (w, h) {
    if (! arguments.length) return this.width * this.height
    this.width = w
    this.height = h || w
    return this
  }
, z: function () {
    var sq = Math.sqrt(this.size())
    return function (d, i) { return -1.0 / sq * ~~ (i % sq) }
  }
, x: function () {
    var sq = Math.sqrt(this.size())
    return function (d, i) { return -1.0 / sq * ~~ (i % sq) }
  }
, y: function () {
    var sq = Math.sqrt(this.size())
    return function (d, i) { return -1.0 / sq * ~~ (i / sq) }
  }
, subImage: function (x, y, data) {
    gl.bindTexture(gl.TEXTURE_2D, this.texture)
    gl.texSubImage2D(gl.TEXTURE_2D, 0, x, y, data.length / 4, 1, gl.RGBA, gl.FLOAT, new Float32Array(data))
  }

, repeat: function () {
    this.task = function () { this.update() }.bind(this)
    tasks.push(this.task)
    return this
  }

, stop : function () {
    this.task && tasks.splice(tasks.indexOf(this.task))
    delete this.task
  }

, appendChild: function (el) {
    if (! this.__renderTarget__) renderable.call(this)
    return this.__scene__[this.__scene__.length] = this.__renderTarget__.append(el.tagName || el)
  }

, valueOf: function () {
    return - this.id
  }

, copy: function () { return pathgl.texture(this.src) }
, pipe: pipeTexture
, querySelector: querySelector
, querySelectorAll: querySelectorAll
, ownerDocument: { createElementNS: function (_, x) { return x } }
, unwrap: unwrap
, adnan: true
, seed: seed
}

function initTexture() {
  var mipmap = mipmappable.call(this)
    , wrap = gl[mipmap ? 'REPEAT' : 'CLAMP_TO_EDGE']
    , filter = gl[mipmap ? 'LINEAR' : 'NEAREST']

  gl.bindTexture(gl.TEXTURE_2D, this.texture)
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, filter)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, filter)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, wrap)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, wrap)
  //if (this.height == this.width && mipmap) gl.generateMipmap(gl.TEXTURE_2D)
  this.update()
}

function parseImage(image) {
  try {
    var query = document.querySelector(image)
    if (query) return query
  } catch (e) {}

  return extend(isVideoUrl ? new Image : document.createElement('video'), { crossOrigin: 'anonymous', src: image})
}

function pipeTexture(ctx) {
  this.dependents.push(ctx)
  return this
}

function readFrom(ctx) {
  this.dependents.push(ctx)
}

function unwrap() {
  var i = this.size() || 0, uv = new Array(i)
  while(i--) uv[i] = { x: this.x()(i, i), y: this.y()(i, i), z: this.z()(i, i) }
  return uv
}

function renderable() {
  extend(this, { __scene__: [] })
  (this.__renderTarget__ = RenderTarget(this))
  .drawTo(this)
  var save  = this.update
  this.update = function () {
    save.call(this)
    this.__renderTarget__.update()
  }
}

function batchTexture () {
  var data = this.data
    , rows = data.rows
    , size = data.width
    , update = this.update.bind(this)
    , c = document.createElement('canvas').getContext('2d')
    , tile = size / rows
    , count = 0

  c.canvas.width = c.canvas.height = size
  data.forEach(function (d, i) {
    var img = parseImage(data[i]),
        sx = tile * (i % rows),
        sy = tile * ~~(i / rows)

    onLoad(img, function () {
      c.drawImage(img, sx, sy, tile, tile)
      update()
    })
  }, this)

  return c.canvas
}

function readFrom(ctx) {
  this.dependents.push(ctx)
}

function parseJSON(json) {
  var buff = new Float32Array(1024), row = 0, count = 0
  for(var key in json) {
    for(var pixel in json[key])
      buff[count++] = json[key][pixel]

    if (count > 1020) this.subImage(0, count, buff)
                    , buff = new Float32Array(1024)
  }
}

function loadTexture()  {
  var image = this.data

  initTexture.call(this)
  this.update(checkerboard)

  onLoad(image, this.update.bind(this))

  return this
}

  function seed(count, origin) {
    var x = 0
      , y = 0
      , chunks = [{ x: x, y: y, size: count }]
      , s = this.height
      console.log(this.height)
    ;(function recur(chunk) {
      var boundary = chunk.x + chunk.size
        , delta = boundary - s
      if (boundary < s) return
      chunk.size -= delta
      chunks.push(chunk = { x: 0, y:(chunk.y + 1) % s, size: delta })
      recur(chunk)
    })(chunks[0])

    for(var i = 0; i < chunks.length; i++) {
      var data = [], j = -1, chunk = chunks[i]
      while(++j < chunk.size)
        data.push(origin[0], origin[1], Math.random() * 4, Math.random() * 4)
        this.subImage(chunk.x, chunk.y, data)
    }
  }
