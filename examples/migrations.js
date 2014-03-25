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
