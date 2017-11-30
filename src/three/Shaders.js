/**
 * Shader parser.
 *
 * @author Patrick Schroen / https://github.com/pschroen
 */

class Shaders {

    constructor() {
        const shaders = {};

        function parseSingleShader(code) {
            const attributes = code.split('#!ATTRIBUTES')[1].split('#!')[0],
                uniforms = code.split('#!UNIFORMS')[1].split('#!')[0],
                varyings = code.split('#!VARYINGS')[1].split('#!')[0];
            while (~code.indexOf('#!SHADER')) {
                code = code.slice(code.indexOf('#!SHADER'));
                const split = code.split('#!SHADER')[1],
                    br = split.indexOf('\n'),
                    name = split.slice(0, br).split(': ')[1];
                let glsl = split.slice(br);
                if (~name.indexOf('.vs')) glsl = attributes + uniforms + varyings + glsl;
                else glsl = uniforms + varyings + glsl;
                shaders[name] = glsl;
                code = code.replace('#!SHADER', '$');
            }
        }

        function parseCompiled(code) {
            const split = code.split('{@}');
            split.shift();
            for (let i = 0; i < split.length; i += 2) {
                const name = split[i],
                    text = split[i + 1];
                if (~text.indexOf('#!UNIFORMS')) parseSingleShader(text);
                else shaders[name] = text;
            }
        }

        function parseRequirements() {
            for (let key in shaders) {
                const object = shaders[key];
                if (typeof object === 'string' && ~object.indexOf('require')) shaders[key] = require(object);
            }
        }

        function require(shader) {
            while (~shader.indexOf('#require')) {
                const split = shader.split('#require('),
                    name = split[1].split(')')[0];
                shader = shader.replace(`#require(${name})`, shaders[name]);
            }
            return shader;
        }

        this.parse = (code, path) => {
            if (!~code.indexOf('{@}')) {
                shaders[path.split('/').last()] = code;
            } else {
                parseCompiled(code);
                parseRequirements();
            }
        };

        this.getShader = file => {
            return shaders[file];
        };

        window.Shaders = this;
    }
}

export { Shaders };