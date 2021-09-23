import { GLSL3, RawShaderMaterial, Uniform } from 'three';

import vertexShader from '../shaders/BasicMaterial.vert.js';
import fragmentShader from '../shaders/BasicMaterial.frag.js';

export class BasicMaterial extends RawShaderMaterial {
    constructor(map) {
        super({
            glslVersion: GLSL3,
            uniforms: {
                tMap: new Uniform(map),
                uAlpha: new Uniform(1)
            },
            vertexShader,
            fragmentShader,
            transparent: true
        });
    }
}
