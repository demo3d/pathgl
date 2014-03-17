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

####pathgl.context()
> returns the WebGL context, or null if webgl was not available

####pathgl.texture(image, options)
> image can be a image or video DOMelement, image or video url, binary data, or a fragment shader
> 

####texture.update
####texture.repeat
####texture.unfold
