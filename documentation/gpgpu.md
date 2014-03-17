PathGL has strong support for GPGPU or General-purpose computing on graphics
processing units. 

Your task may be a good fit for the gpu if it can benefit from thousands of
threads running in parallel. Examples include physics simulations, FFT, image
processing effects like glows and edge detection, and query analysis.

The idea is that creating a square with dimensions 1000x1000  about
1 million fragment processors. The output of these threads are then captured
in a texture, which can then be sampled as input, allowing state to be
passed between frames.
