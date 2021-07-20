import { RawShaderMaterial, Uniform } from 'three';

import vertexShader from '../shaders/ShadowMaterial.vert.js';
import fragmentShader from '../shaders/ShadowMaterial.frag.js';

export class ShadowMaterial extends RawShaderMaterial {
    constructor(map) {
        super({
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
