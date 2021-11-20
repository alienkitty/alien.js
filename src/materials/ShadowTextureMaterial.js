import { GLSL3, RawShaderMaterial, Uniform } from 'three';

import vertexShader from '../shaders/ShadowTextureMaterial.vert.js';
import fragmentShader from '../shaders/ShadowTextureMaterial.frag.js';

export class ShadowTextureMaterial extends RawShaderMaterial {
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
