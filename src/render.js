//render points
//render lines
//render linefills

function runLoop(elapsed) {
  each(programs, function (program, key) {
    gl.useProgram(program)
    program.time && gl.uniform1f(program.time, pathgl.time = elapsed / 1000)
    program.mouse && gl.uniform2fv(program.mouse, pathgl.mouse)
  })
    canvas.__scene__.forEach(function (node) { node.render() })
  drawCircles()
  return stopRendering && ! gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT)
}

function drawCircles() {
  var allCircles = canvas.__scene__.filter(function (d) {
                     return d instanceof types['circle']
                   }).map(function (d) {
                     return [d.attr.cx, d.attr.cy, d.attr.r]
                   })

  allCircles = allCircles.reduce(function (buffer, circle, i) {
                 buffer[i] = circle[0]
                 buffer[i * 2] = circle[1]
                 buffer[i * 3] = circle[2]
                 return buffer
               }, new Float32Array(allCircles.length * 3))

  gl.bufferData(gl.ARRAY_BUFFER, allCircles, gl.DYNAMIC_DRAW)
  gl.vertexAttribPointer(program.vertexPosition, 3, gl.FLOAT, false, 0, 0)
  gl.enableVertexAttribArray(program.vertexPosition)
  gl.drawArrays(gl.POINTS, 0, allCircles)
}

function addToBuffer(datum) {
  return extend(datum.path = [], { coords: [], id: datum.id })
}

function applyTransforms(node) {
  gl.uniform2f(program.translate, node.attr.translate[0] + node.attr.cx + node.attr.x,
               node.attr.translate[1] + node.attr.cy + node.attr.y)
  gl.uniform2f(program.scale, node.attr.scale[0], node.attr.scale[1])
  gl.uniform2f(program.rotation, node.attr.rotation[0], node.attr.rotation[1])
  gl.uniform1f(program.opacity, node.attr.opacity)
}

function drawBuffer(buffer, type) {
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
  gl.vertexAttribPointer(program.vertexPosition, buffer.itemSize, gl.FLOAT, false, 0, 0)
  gl.drawArrays(type, 0, buffer.numItems)
}

function swapProgram(name) {
  gl.useProgram(program = programs[name])
  program.vertexPosition = gl.getAttribLocation(program, "aVertexPosition")
  gl.enableVertexAttribArray(program.vertexPosition)
}

function drawFill(node) {
  swapProgram(isId(node.attr.fill) ? node.attr.fill : '_identity')
  applyTransforms(node)
  setDrawColor(d3.rgb(node.attr.fill))
  drawBuffer(node.buffer, gl.TRIANGLE_FAN)
}

function drawStroke(node) {
  gl.lineWidth(node.attr['stroke-width'])
  swapProgram(isId(node.attr.stroke) ? node.attr.stroke : '_identity')
  applyTransforms(node)
  setDrawColor(d3.rgb(node.attr.stroke))
  if (node.path)
    for (var i = 0; i < node.path.length; i++)
      drawBuffer(node.path[i], gl.LINE_LOOP)
  //else console.log(node.id)
  //this should be impossible
}

function setDrawColor (c) {
  gl.uniform4f(program.rgb,
               c.r / 256,
               c.g / 256,
               c.b / 256,
               1.0)
}

//subData
function buildBuffer(points) {
  var buffer = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(points), gl.STATIC_DRAW)
  buffer.itemSize = 3
  buffer.numItems = points.length / buffer.itemSize
  return buffer
}

function toBuffer (array) {
  return buildBuffer(flatten(array))
}
