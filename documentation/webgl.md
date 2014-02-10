These docs are extremely in progress. Check back Feb 11 

This page serves as an introduction to webgl for those who have never used it.

What does WebGL do?

1. cpu sends list of points to gpu
2. vertex shader places points on screen
3. fragment shader colors pixels

The second two stages run completely on your graphics card. This means we want to
offload as much work as we can to them, so that your cpu is free to do other things,
like handle user input.

Most data visualization code does not rebuffer new data on every frame. The geometry
is roughly static. By animating static geometries using only shaders, we can animate
millions of elements at 60fps, even on your phone.

Perceptual and interactive scalability should be limited by the chosen resolution of
the visualized data, not the number of records. I present a method for drawing
millions of data points using d3's high level of abstraction and webGL's performance and
control.

You can reach a point with d3 where, between the conceptual simplicity, the minimal
api, and the power of webgl, you are able to write only code that
matters. And, once there, you are able to achieve a very high degree of focus, such
as you would when playing Go, or playing a musical instrument, or meditating. And
then, as with those activities, there can be a feeling of elation that accompanies
that mental state of focus.
