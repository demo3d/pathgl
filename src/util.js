var log = console.log.bind(console)

function noop () {}

function extend (a, b) {
  if (arguments.length > 2) [].forEach.call(arguments, function (b) { extend(a, b) })
  else for (var k in b) a[k] = b[k]
  return a
}

function twoEach(list, fn, gl) {
  var l = list.length - 1, i = 0
  while(i < l) fn.call(gl, list[i++], list[i++])
}

function isId(str) {
  return false
}

function each(obj, fn) {
  for (var key in obj) fn(obj[key], key, obj)
}

function hash(str) {
  return str.split("").reduce(function(a,b) { a = ((a << 5) - a) + b.charCodeAt(0); return a & a }, 0)
}

function uniq(ar) { return ar.filter(function (d, i) { return ar.indexOf(d) == i }) }

function push(d) { return this.push(d) }

function flatten(ar) { return ar.reduce(function (a, b) { return a.concat(b.map ? flatten(b) : b) }) }

function clamp (a, x) {
  a = Math.abs(a)
  return x < -a ? -a : x > a ? a : x
}

function range(a, b) {
  return Array(Math.abs(b - a)).join().split(',').map(function (d, i) { return i + a })
}

function powerOfTwo(x) {
  return x && ! (x & (x - 1))
}


function pointInPolygon(x, y, shape) {
}

function isVideoUrl(url) {
  return (url.split('.').pop() || '').join().match(/mp4|ogg|webm/)
}