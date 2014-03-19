GPGPU is a technique for offloading heavy computation to the graphics card.

Creating a square with dimensions 1000x1000 spawns 1 million
threads. The output of these threads can written to a texture,
which can then be sampled as input on the next cycle, allowing state to be
passed between frames.

In webGL, a pixel is a vector with 4 floats. Typically these
elements represent RGBA color channels, but we can use them for anything.
For example, by thinking of each pixel as a vector containing
``(positionX, positionY, velocityX, velocityY)``, we can simulate a particle by
integrating velocity into position on every frame.

A task may benefit from gpgpu if it 
1. has a high computation to IO ratio
2. decomposes cleanly to map, reduce, filter, scatter, gather, sort, and search operations
3. has minimal dependency between data elements

Examples include fft, image processing, simulating physical models like weather and
cosmology, neural networks, cryptography, and so on. 

Currently, gpgpu programs must be written as fragment shaders in GLSL, a statically typed
javascript-like language with specialized support for vector manipulation.

In the near future, gpgpu may be possible with compute shaders, or even webCL, which
will decouple render specific details  from gpgpu entirely.

