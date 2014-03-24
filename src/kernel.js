pathgl.kernel = kernel

function kernel () {
  var source = []
    , target = null

  var self = {
      read: read
    , write: write
    , match: match
    , exec: exec
  }

  return self

  function read() {
    source = [].slice.call(arguments)
  }

  function write() {

  }

  function match() {

  }

  function exec () {

  }
}