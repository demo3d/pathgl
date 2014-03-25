var selector = 'svg'
var size = { width: .85 * innerWidth, height: innerHeight * .9 }
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

d3.json('data/birds.json', draw_birds)
d3.json('data/world-50m.json', draw_world)

function draw_world(err, world) {
  if (err) svg.append('path')
  .attr('class', 'graticule noclick')
  .datum(d3.geo.graticule())
  .attr('d', path)
  .attr('stroke-dasharray', '3 3')
  .attr('fill', 'none')
  .attr('stroke', '#999')

  svg.append("path")
  .datum(topojson.mesh(world, world.objects.countries, function(a, b) { return a == b && a.id !== 10 }))
  .attr({ class: 'world'
        , d: path
        , fill: 'none'
        , 'stroke': 'grey'
        , 'stroke-width': 1
        })
}

function draw_birds(err, data) {
  data.forEach(function (d) {
    d.location = proj([d[1], d[0]])
  })
  webgl
    .selectAll('circle')
    .data(data)
    .enter()
    .append('circle')
    .attr({ class:'event'
          , stroke: function(d){ return d3.hsl(Math.random()*120, .9, 0.5) }
          , cx: function(d){ return d.location[0] * 1.1  }
          , cy: function(d){ return d.location[1] / 2 + 50}
          , cz: function(d){ return d[2] }
          , r: 5
          })
    .shader({'r': '5. - distance(pos.w, dates.x);'})
}
var x = 0
setInterval(function () {
  pathgl.uniform('dates', [x = (x + .2) % 52, 0])
}, 32)

//lat long week num_cites