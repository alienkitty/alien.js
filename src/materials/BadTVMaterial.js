import { NoBlending, RawShaderMaterial, Uniform } from 'three';

import vertexShader from '../shaders/BadTVPass.vert.js';
import fragmentShader from '../shaders/BadTVPass.frag.js';

export class BadTVMaterial extends RawShaderMaterial {
    constructor() {
        super({
            uniforms: {
                tMap: new Uniform(null),
                uDistortion: new Uniform(0),
                uDistortion2: new Uniform(0),
                uRollSpeed: new Uniform(0),
                uTime: new Uniform(0)
            },
            vertexShader,
            fragmentShader,
            blending: NoBlending,
            depthWrite: false,
            depthTest: false
        });
    }
}
