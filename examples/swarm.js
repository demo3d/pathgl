

var stroke = 'unpack_color(stroke) + vec4(0.5 + sin (1.0 / length (vec2(x,y)) + time * 8.0) * 0.5, '
             + '0.5 + sin (atan(y, x) + sin (time * 0.2) * 3.14159 * 8.0) * 0.5, '
             + '0.5 + sin (1.0 / length (vec2(x,y)) + time * 4.0) * sin(atan(y, x) + sin (time * 0.2) * 3.14159 * 4.0'
             + '), 1.)'

d3.select('canvas').call(pathgl)
.selectAll("circle")
.data(d3.range(1e5))
.enter().append("circle")
.attr('fill', function () { return "hsl(" + Math.random() * 360 + ",100%, 50%)" })
.attr('cx', function (d, i) { return d / 1e8 })
.attr('r', function (d, i) { return d  % 1000 })
.shader({ cx: 'resolution.x / 2. + cos(-clock / mouse.x * pos.x * pos.z) * pos.z * 10.;'
        , cy: 'resolution.y / 2. + sin(-clock / mouse.y * pos.x * pos.z) * pos.z * 10.;'
        , stroke: stroke
        , r: ' ((distance(y, resolution.y / 2.) < 15.) && (distance(x, resolution.x / 2.) < 11.)) ? 0. : pow(distance(mouse, vec2(x, y)) / distance(vec2(0.), resolution) * 8., 2.)'
        })
'pos.y + pos.y * max(distance(x, mouse.x) / resolution.x, distance(y, mouse.y) / resolution.y)'