pathgl.kernel = kernel

function kernel () {
  var source = []
    , target = null

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
    return this
  }

  function write() {
    return this
  }

  function map () {
    return this
  }

  function matchWith() {
    return this
  }

  function exec() {
    return this
  }
}