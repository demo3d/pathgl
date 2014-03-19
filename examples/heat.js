
function debug () {
  var canvas = d3.select('canvas').call(pathgl)

  var physics = pathgl.texture()

  d3.select(physics)
  .selectAll('circle')
  .data(d3.range(100), function (d) { return d })
  .enter()
  .append('rect')
  .attr('width', 30)
  .attr('height', 30)
  .attr('x', function (d) { return 100 * (d % 10) })
  .attr('y', function (d) { return 60 * ~~(d / 10) })
  .attr('fill', function () { return 'hsl(' + Math.random() * 360 + ',100%, 50%)' })

  physics.repeat()
  canvas
  .selectAll("circle")
  .data(d3.range(100), function (d) { return d })
  .enter().append("circle")
  .attr('r', 50)
  .attr('cx', function (d) { return 100 * (d % 10) })
  .attr('cy', function (d) { return 100 * ~~(d / 10) })
  .attr('fill', physics)

  return physics
}