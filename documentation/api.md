
####pathgl([element])
> Takes a canvas element, css3 selector, or d3 selection as an argument
> if webgl is not available, returns null
> otherwise the canvas element is returned
> If called without arguments, appends a 960x500 webgl canvas to the sceern.

####pathgl.texture(image)
> Takes a string, image tag or typed array
> The string needs to be either a url, css3 selector, or fragment shader.
> returns an object which represents the texture's location in video memory.
> you can pass this object as the fill or stroke attribute of any element

####pathgl.uniform(name, [value])
> Set a variable that is global to all shader contexts.
> If called without a value, will return previously set value.
> Default uniforms include mouse, resolution, and clock.

#### d3.selection.shader(name, GLSL_expression)
> Inline's an abitrary string into the shader that renders this selection
> The expression language is untyped GLSl.
> Any svg attribute from that mark can be used in the expression.
> For more information, please see the [shader documentation](http://pathgl.com/documentation/shaders).

####pathgl.registerShader('name', GLSL_expression)
> Adds a function to all shaders to be used in any 
> Use this to create custom effects, or create more complex expressions than can fit
> on a single line

####pathgl.context()
> returns the WebGL context, or null if webgl was not available


####d3.transition.shader(name, expression)
> ...

Currently, the scene graphi API is private and subject to rapid change.
Instead of manipulating pathgl marks directly, use a library like d3 to build your
scene.
