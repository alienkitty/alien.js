import { GLSL3, NoBlending, RawShaderMaterial } from 'three';

import vertexShader from '../shaders/AfterimagePass.vert.js';
import fragmentShader from '../shaders/AfterimagePass.frag.js';

export class AfterimageMaterial extends RawShaderMaterial {
    constructor() {
        super({
            glslVersion: GLSL3,
            uniforms: {
                tOld: { value: null },
                tNew: { value: null },
                uDamping: { value: 0.96 }
            },
            vertexShader,
            fragmentShader,
            blending: NoBlending,
            depthWrite: false,
            depthTest: false
        });
    }
}
