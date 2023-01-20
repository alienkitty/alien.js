import { GLSL3, NoBlending, RawShaderMaterial } from 'three';

import vertexShader from '../shaders/LuminosityPass.vert.js';
import fragmentShader from '../shaders/LuminosityPass.frag.js';

export class LuminosityMaterial extends RawShaderMaterial {
    constructor() {
        super({
            glslVersion: GLSL3,
            uniforms: {
                tMap: { value: null },
                uThreshold: { value: 1 },
                uSmoothing: { value: 1 }
            },
            vertexShader,
            fragmentShader,
            blending: NoBlending,
            depthWrite: false,
            depthTest: false
        });
    }
}
