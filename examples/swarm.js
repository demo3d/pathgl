d3.select('canvas').call(pathgl)
.selectAll("circle")
.data(d3.range(2e5))
.enter().append("circle")
.attr('fill', function () { return "hsl(" + Math.random() * 360 + ",100%, 50%)" })
.attr('cx', function (d, i) { return d / 1e8 })
.attr('cy', function (d, i) { return (2e5  -  d) / 20000 })
.attr('r', function (d, i) { return d  % 1000 })
.shader({ cx: 'resolution.x / 2. + cos(pos.z + clock * pos.x) * pos.z * 10.;'
        , cy: 'resolution.y / 2. + sin(pos.z + clock * pos.x) * pos.z * 10.;'
        , stroke: 'vec4(unpack_color(stroke).xyz * .5 + vec3(mouse.x / resolution.x, mouse.y / resolution.y, 1.), 1.);'
        , r: 'pos.y + pos.y * max(distance(x, mouse.x) / resolution.x, distance(y, mouse.y) / resolution.y)'
        })