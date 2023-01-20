import { Color, GLSL3, RawShaderMaterial } from 'three';

import vertexShader from '../shaders/ColorMaterial.vert.js';
import fragmentShader from '../shaders/ColorMaterial.frag.js';

export class ColorMaterial extends RawShaderMaterial {
    constructor(color) {
        super({
            glslVersion: GLSL3,
            uniforms: {
                uColor: { value: color instanceof Color ? color : new Color(color) }
            },
            vertexShader,
            fragmentShader
        });
    }
}
