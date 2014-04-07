function parsePath(str) {
  var buffer = []
    , pos = [0, 0]
    , origin = [0, 0]

  str.match(/[a-z][^a-z]*/ig).forEach(function (segment, i, match) {
    var points = segment.slice(1).trim().split(/,| /g), c = segment[0].toLowerCase(), j = 0
    while(j < points.length) {
      var x = points[j++], y = points[j++]
      c == 'm' ?  (1,(origin = pos = [x, y])) :
        c == 'l' ? buffer.push(pos, [x, y]) && (pos = [x, y]) :
        c == 'z' ? buffer.push(pos, [origin[0], origin[1]]) && (pos = origin) :
        console.log('%d method is not supported malformed path:', c)
    }
  })


  buffer = ppp(buffer)

  this.posBuffer.set(buffer, 0)
  this.indices = buffer.map(function (d, i) { return i })
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


function ppp (a) {
  return flatten(a)
}