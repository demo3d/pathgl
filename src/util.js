
function noop () {}

function identity(x) { return x }

function push(d) { return [].push.call(this, d) }

function powerOfTwo(x) { return x && ! (x & (x - 1)) }

function nextSquare(n) { return Math.pow(Math.ceil(Math.sqrt(n)), 2) }

function each(obj, fn) { for (var key in obj) fn(obj[key], key, obj) }

function clamp (x, min, max) { return Math.min(Math.max(x, min), max) }

function Quad () { return [-1.0, -1.0, 1.0, -1.0, -1.0,  1.0, 1.0,  1.0] }

function isVideoUrl(url) { return url.split('.').pop().join().match(/mp4|ogg|webm/) }

function uniq(ar) { return ar.filter(function (d, i) { return ar.indexOf(d) == i }) }

function flatten(list){ return list.reduce(function( p,n){ return p.concat(n) }, []) }

function svgToClipSpace(pos) { return [2 * (pos[0] / 960) - 1, 1 - (pos[1] / 500 * 2)] }

function append () { [].forEach.call(arguments, push, this) }

function range(a, b) { return Array(Math.abs(b - a)).join().split(',').map(function (d, i) { return i + a }) }

function hash(str) { return str.split("").reduce(function(a,b) { a = ((a << 5) - a) + b.charCodeAt(0); return a & a }, 0) }

function extend (a, b) {
  if (arguments.length > 2) [].forEach.call(arguments, function (b) { extend(a, b) })
  else for (var k in b) a[k] = b[k]
  return a
}

function pointInPolygon(x, y, shape) {}
