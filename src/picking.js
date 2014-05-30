//cpu intersection tests
//offscreen render color test

var pickings  = {}
function addEventListener(evt, listener, capture) {
  (pickings[this.attr.cx | 0] = (pickings[this.attr.cx | 0] || {})
  )[this.attr.cy | 0] = this
}

function pick (x, y) {
  if (pickings[x] && pickings[x][y])
    pickings[x][y].trigger('mousemove')
}
