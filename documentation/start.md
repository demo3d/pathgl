Download the latest version and include it in your html.
Or link directly to the latest release, copy this snippet:
<script src="http://adnanwahab.com/pathgl/dist/pathgl.min.js"></script>

<script>
d3.select('canvas').call(pathgl)
.append('circle')
.attr('r', 100)
.attr('cx', 50)
.attr('cy', 50)
</script>

pathgl extends the d3 'language' with 2 new primitives: shaders and textures.
