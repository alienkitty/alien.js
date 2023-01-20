import { Color, GLSL3, RawShaderMaterial } from 'three';

import vertexShader from '../shaders/TextMaterial.vert.js';
import fragmentShader from '../shaders/TextMaterial.frag.js';

export class TextMaterial extends RawShaderMaterial {
    constructor({
        map,
        color
    } = {}) {
        super({
            glslVersion: GLSL3,
            uniforms: {
                tMap: { value: map },
                uColor: { value: color instanceof Color ? color : new Color(color) },
                uAlpha: { value: 1 }
            },
            vertexShader,
            fragmentShader,
            transparent: true
        });
    }
}
