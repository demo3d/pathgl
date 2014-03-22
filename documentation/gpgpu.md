GPGPU is a technique for offloading heavy computation to the graphics card.

GPGPU programs are written as fragment shaders in GLSL, a statically typed
javascript-like language with specialized support for vector manipulation.

In webGL, a pixel is a vector with 4 floats. Typically these
elements represent RGBA color channels, but we can use them for anything.
For example, by thinking of each pixel as a vector containing
``(positionX, positionY, velocityX, velocityY)``, we can simulate a particle by
integrating velocity into position on every frame.

Drawing a square with dimensions 1000x1000 spawns 1 million
threads. The output of these threads can be written to a texture,
which is then sampled as input on the next cycle, allowing state to be
passed between frames.

Characteristics of graphics programming. Your task may benefit from gpgpu if it has similar characteristics
1. large computational requirements
2. massive paralllelism
3. long latencies ok
4. deep, feed forward pipelines. data flows one way
5. hacks are ok - can tolerate lack of accuracy
6. decomposes cleanly to map, reduce, filter, scatter, gather, sort, and search operations
7. has minimal dependency between data elements

Examples include fft, image processing, simulating physical models like weather and
cosmology, neural networks, cryptography, and so on. 
