
####pathgl([element])
> Takes a canvas element, css3 selector, or d3 selection as an argument
> if webgl is not available, returns null
> otherwise the canvas element is returned
> If called without arguments, appends a 960x500 webgl canvas to the sceern.

####pathgl.uniform(name, [value])
> Set a variable that is global to all shader contexts.
> If called without a value, will return previously set value.
> Default uniforms include mouse, resolution, and clock.

#### d3.selection.shader(name, GLSL_expression)
> Injects's an abitrary expression into the vertex shader that renders this selection
> [Indepth tutorial](http://pathgl.com/documentation/shaders).

####pathgl.registerShader('name', GLSL_expression)
> Adds a function to all shaders to be used in any 
> Use this to create custom effects, or create more complex expressions than can fit
> on a single line

####pathgl.texture(image, options)
> image can be a image or video DOMelement, image or video url, binary data, or a fragment shader
> subclasses d3.selection(if d3 is available) so you can treat it as just another render target 
> this is useful if you want to do post processing or want to render selections at different intervals

####pathgl.context()
> returns the WebGL context, or null if webgl was not available


####d3.transition.shader(name, expression)
> ...

####texture.update
####texture.repeat
####texture.unfold


Currently, the scene graphi API is private and subject to rapid change.
Instead of manipulating pathgl marks directly, use a library like d3 to build your
scene.
