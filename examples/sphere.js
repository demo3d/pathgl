var width = size.width,
    height = size.height,
    rotate = [10, -10],
    velocity = [.03, -.001],
    time = Date.now();

var projection = d3.geo.orthographic()
                 .scale(240)
                 .translate([width / 2, height / 2])
                 .clipAngle(90 + 1e-6)
                 .precision(.3);

var path = d3.geo.path()
           .projection(projection);

var graticule = d3.geo.graticule();

var svg = d3.select('canvas')
          .attr("width", width)
          .attr("height", height)
          .call(pathgl)

svg.append("path")
.datum({type: "Sphere"})
.attr("class", "sphere")
.attr('stroke', 'orange')
.attr("d", path)

svg.append("path")
.datum(graticule)
.attr("class", "graticule")
.attr('stroke', 'green')
.attr("d", path)

svg.append("path")
.datum({type: "LineString", coordinates: [[-180, 0], [-90, 0], [0, 0], [90, 0], [180, 0]]})
.attr("class", "equator")
.attr('stroke', 'blue')
.attr("d", path)

var feature = svg.selectAll('path')

svg.selectAll('path')
.attr('fill', 'none')

d3.timer(function() {
  var dt = Date.now() - time
  projection.rotate([rotate[0] + velocity[0] * dt, rotate[1] + velocity[1] * dt])
  feature.attr("d", path)
})
