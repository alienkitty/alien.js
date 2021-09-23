import { Color, GLSL3, RawShaderMaterial, Uniform } from 'three';

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
                tMap: new Uniform(map),
                uColor: new Uniform(color instanceof Color ? color : new Color(color)),
                uAlpha: new Uniform(1)
            },
            vertexShader,
            fragmentShader,
            transparent: true
        });
    }
}
