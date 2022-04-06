import { GLSL3, NoBlending, RawShaderMaterial, Uniform } from 'three';

import vertexShader from '../shaders/AfterimagePass.vert.js';
import fragmentShader from '../shaders/AfterimagePass.frag.js';

export class AfterimageMaterial extends RawShaderMaterial {
    constructor() {
        super({
            glslVersion: GLSL3,
            uniforms: {
                tOld: new Uniform(null),
                tNew: new Uniform(null),
                uDamping: new Uniform(0.96)
            },
            vertexShader,
            fragmentShader,
            blending: NoBlending,
            depthWrite: false,
            depthTest: false
        });
    }
}
