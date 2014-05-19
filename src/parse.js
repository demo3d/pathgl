function parsePath(str) {
  var buffer  = []
    , pos = [0, 0]
    , origin = [0, 0]

  var contours = []
  contours.push([])
  str.match(/[mzlhvcsqta][^a-z]*/ig).forEach(function (segment, i, match) {
    var points = segment.slice(1).trim().split(/,| /g), c = segment[0].toLowerCase(), j = 0
    while(j < points.length) {
      var x = points[j++], y = points[j++]
      c == 'm' ? (contours.push(buffer = []) ,(origin = pos = [x, y])) :
        c == 'l' ? buffer.push(x, y) && (pos = [x, y]) :
        c == 'z' ? buffer.push(origin[0], origin[1]) && (pos = origin) :
        c == 'h' ? buffer.push(x, pos[1]) && (pos[0] = x) :
        c == 'v' ? buffer.push(pos[0], x) && (pos[1] = x) :
        console.log('%s method is not supported malformed path:', c)
    }
  })

  this.indices = this.mesh.spread(this.indices, triangulate(contours))

  var off = this.mesh.tessOffset
  this.posBuffer.set(buffer, off)
}

function applyCSSRules () {
  if (! d3) return console.warn('this method depends on d3')
  d3.selectAll('link[rel=styleSheet]').each(function () {
    d3.text
  })

  var k = d3.selectAll('style')[0].map(function () { return this.sheet })
          .reduce(function (acc, item) {
            var itemRules = {}
            each(item.cssRules, function (rules, i) {
              var l = rules.length, cssom = {}
              while(l--) {
                var name = rules[rules[l]]
                cssom[name] = rules[name]
              }
              itemRules[rules.selectorText] = cssom
            })
              return extend(acc, itemRules)
          }, {})

  each(k, function (styles, selector) {
    d3.select(selector).attr(styles)
  })
}

function matchesSelector(selector) {
  if (isNode(selector)) return this == selector
  if (isFinite(selector.length)) return !!~flatten(selector).indexOf(this)
  for (var selectors = selector.split(','), tokens, dividedTokens; selector = selectors.pop(); tokens = selector.split(tokenizr).slice(0))
    if (interpret.apply(this, q(tokens.pop())) && (!tokens.length || ancestorMatch(this, tokens, selector.match(dividers)))) return true
}
