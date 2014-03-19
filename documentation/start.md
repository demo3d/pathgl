Download the latest version and include it in your html.
Or link directly to the latest release, copy this snippet:
<script src="http://d3js.org/d3.v3.min.js" charset="utf-8"></script>
<script src="http://adnanwahab.com/pathgl/dist/pathgl.js"></script>
<script>
d3.select('canvas').call(pathgl)
.append('circle')
.attr('r', 100)
.attr('cx', 50)
.attr('cy', 50)
.attr('fill', 'pink')
</script>

If you don't see a pink circle, something is wrong uh oh.
