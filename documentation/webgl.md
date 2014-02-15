These docs are extremely in progress. Check back Feb 11 

This page serves as an introduction to webgl for those who have never used it.

What does WebGL do?

1. javascript sends list of points to GPU
2. gpu converts points to 
2. vertex shader places points on screen
3. fragment shader colors pixels

The second two stages run completely on your graphics card. This means we want to
offload as much work as we can to them, so that your cpu is free to do other things,
like handle user input.

Most data visualization code does not rebuffer new data on every frame. The geometry
is roughly static. By animating static geometries using only shaders, we can animate
millions of elements at 60fps, even on your phone.



