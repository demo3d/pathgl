## API Reference

####pathgl([element])
> Takes a canvas element, css3 selector, or d3 selection as an argument
> initialize the webgl context and returns the patched canvas element
> if webgl is not available, returns false
> If called without arguments, appends a 960x500 canvas to the sceern.

####pathgl.uniform(name, [value])
> Set a variable that is global to all shader contexts.
> If called without a value, will return previously set value.
> Default uniforms include mouse, resolution, and clock.

####pathgl.registerShader('name', GLSL_expression)
> Adds a function to all shaders to be used in any 
> Use this to create custom effects, or create more complex expressions than can fit
> on a single line

####pathgl.context()
> returns the WebGL context, or null if webgl was not available

####pathgl.texture(image, options)
> image can be a image or video DOMelement, image or video url, binary data, or a fragment shader
> subclasses d3.selection(if d3 is available) so you can treat it as just another render target 
> this is useful if you want to do post processing or want to render selections at different intervals

####texture.update
####texture.repeat
####texture.unfold

#### d3.selection.shader(name, GLSL_expression)
> Injects's an abitrary expression into the vertex shader that renders this selection

####d3.transition.shader(name, expression)
> ...

Currently, the scene graphi API is private and subject to rapid change.
Instead of manipulating marks directly, use a library like d3 to build your
scene.
