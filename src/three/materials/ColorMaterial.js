import { Color, GLSL3, RawShaderMaterial } from 'three';

import { vertexShader, fragmentShader } from '../../shaders/ColorShader.js';

export class ColorMaterial extends RawShaderMaterial {
    constructor({
        color,
        instancing = false
    } = {}) {
        const parameters = {
            glslVersion: GLSL3,
            defines: {
            },
            uniforms: {
                uColor: { value: color instanceof Color ? color : new Color(color) },
                uAlpha: { value: 1 }
            },
            vertexShader,
            fragmentShader
        };

        if (instancing) {
            parameters.defines = Object.assign(parameters.defines, {
                USE_INSTANCING: ''
            });
        }

        super(parameters);
    }
}
