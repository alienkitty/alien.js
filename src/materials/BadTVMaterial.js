import { GLSL3, NoBlending, RawShaderMaterial } from 'three';

import vertexShader from '../shaders/BadTVPass.vert.js';
import fragmentShader from '../shaders/BadTVPass.frag.js';

export class BadTVMaterial extends RawShaderMaterial {
    constructor() {
        super({
            glslVersion: GLSL3,
            uniforms: {
                tMap: { value: null },
                uDistortion: { value: 3 },
                uDistortion2: { value: 5 },
                uSpeed: { value: 0.2 },
                uRollSpeed: { value: 0.1 },
                uTime: { value: 0 }
            },
            vertexShader,
            fragmentShader,
            blending: NoBlending,
            depthWrite: false,
            depthTest: false
        });
    }
}
