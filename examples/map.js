var selector = 'svg'
var size = {width: .85 * innerWidth, height: innerHeight * .9}
var width = size.width,
    height = size.height,
    rotate = [10, -10],
    velocity = [.03, -.001],
    time = Date.now();

var simplify = d3.geo.transform({ point: function(x, y, z) { this.stream.point(x, y); } })
var proj = d3.geo.wagner4().scale(225).translate([size.width / 2 - 75, size.height / 2]).precision(.1)
  , path = d3.geo.path().projection(proj)

var svg = d3.select(selector)
          .attr("width", width)
          .attr("height", height)

var webgl = d3.select('canvas').attr(size).attr('class', 'no-click')
var p = d3.select('.blurb')

d3.select('.blurb').text('Click circles for more information.')

d3.json('data/world-50m.json', draw_world)
d3.csv('data/hist.csv', draw_history)

function mouseover(d) {
  d3.select('.title').text(d.title + ' ' + d.year + ', '  + d.event);
}

function draw_world(err, world) {
  if (err) svg.append('path')
  .attr('class', 'graticule noclick')
  .datum(d3.geo.graticule())
  .attr('d', path)
  .attr('stroke-dasharray', '3 3')
  .attr('fill', 'none')
  .attr('stroke', 'aliceblue')

  svg.append("path")
  .datum(topojson.mesh(world, world.objects.countries, function(a, b) { return a == b && a.id !== 10 }))
  .attr({ class: 'world'
        , d: path
        , fill: 'none'
        , 'stroke': 'grey'
        , 'stroke-width': 1
        })
}

function draw_history(err, hist) {
  var dates, m, to
    , from = -500

  d3.select('body')
  .append('div')
  .attr('class', 'current_year')

  var gram = d3.layout.histogram()
             .bins(size.width / 5)
             .range([-500, 2030])
             .value(function (d) { return + d.year })(hist)

  var x = d3.scale.linear()
          .domain([-500, 2010])
          .range([0, size.width])

  var y = d3.scale.pow().exponent(.8)
          .domain([0, d3.max(gram, function (d) { return d.y })])
          .range([0, size.height * .3])

  var xAxis = d3.svg.axis()
              .scale(x)
              .orient("bottom")

  svg.selectAll('rect')
  .data(gram).enter()
  .append('rect')
  .attr('fill', 'indianred')
  .attr('width', 4)
  .attr('height', function (d) { return y(d.y)  })
  .attr('x', function (d, i) { return x(d.x)  })
  .attr('y', function (d) { return size.height - y(d.y) - 30 })

  var axis = d3.svg.axis()
             .scale(x)
             .orient("bottom")

  svg.append("g")
  .attr("class", "x axis")
  .attr("transform", "translate(0," + (size.height - 30) + ")")
  .call(xAxis)

  svg
  .on('click', function () { from = ~~ x.invert(+d3.mouse(this)[0]) })
  var brush = d3.svg.brush().x(x).on("brush", brushmove).extent([-500, -400])

  var b = svg.append("g")
          .attr("class", "brush")
          .call(brush)
          .attr('transform', 'translate(' + [0, height * .85] +  ')')

  b.selectAll("rect")
  .attr('fill', 'pink')
  .attr('opacity', '.7')
  .attr("height", height * .1)
  .on('mouseover', function () { this.pause = 1 })
  .on('mouseout', function () { this.pause = 0 })


  setInterval(function () {
    if (b.node().pause) return
    if (brush.empty()) brush.extent([0, 10])
    brush.extent(brush.extent().map(function (d) { return d + 1 })).event(b)
;    b.call(brush)
  }, 16)

  function brushmove() {
    adnan(d3.event.target.extent())
  }

  var tip = d3.tip().attr('class', 'd3-tip').html(function(d) { return d.event })

  function adnan (s) {
    pathgl.uniform('dates', s)
    document.title = s.map(Math.round)
    d3.select('.current_year').text(from < 0 ? '' + Math.abs(+from) + ' BC' : from)
    svg.on('click', function () {
      var x = d3.event.x, y = d3.event.y

      var event = hist.filter(function (event) {
                    return s[0] < (+ event.year)  && (+ event.year) < s[1]
                  }).map(function (e) {
                    var c = e.node
                      e.dist = distance(c.attr.cx, c.attr.cy, x, y)
                      return e
                    })
                    .sort(function (a, b) { return a.dist - b.dist })
        p.text(event.length && event[0].event)
      })
    }
    adnan([-500, -400])

    d3.select('.right').insert('p', '*')
    .attr('class', 'title')
    .style({ color: 'white'
           , position: 'absolute'
           , top: 475 + 'px'
           , left: 150 + 'px'
           , width: "35%"
           , 'font-size': '10px'
           , 'text-anchor': 'end'
           })

    hist = hist.sort(function(a, b) { return a.year - b.year })
    hist.forEach(function(d) {
      d.location = proj(d.location.split(' ').map(parseFloat).reverse()) || d
    })

    pathgl.uniform('dates', [0, 1])

    webgl
    .selectAll('circle')
    .data(hist)
    .enter()
    .append('circle').call(tip)
    .attr({ class:'event'
          , stroke: function(d){ return d3.hsl(Math.random()*120 + 120, .9, 0.5) }
          , cx: function(d){ return d.location[0] }
          , cy: function(d){ return d.location[1] }
          , cz: function(d){ return + d.year }
          , r: 5
          })
    .shader({
      'r': '(pos.w < dates.y && pos.w > dates.x) ? 20. : 20. - (min(distance(pos.w, dates.y), distance(pos.w, dates.x)) );'
    })
    .each(function (d) { return d.node = this })
  }

function distance (x1, y1, x2, y2) {
  var xd = x2 - x1, yd = y2 - y1
  return xd * xd + yd * yd
}