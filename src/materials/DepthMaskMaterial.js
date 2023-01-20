import { GLSL3, NoBlending, RawShaderMaterial } from 'three';

import vertexShader from '../shaders/DepthMaskPass.vert.js';
import fragmentShader from '../shaders/DepthMaskPass.frag.js';

export class DepthMaskMaterial extends RawShaderMaterial {
    constructor() {
        super({
            glslVersion: GLSL3,
            uniforms: {
                tMap: { value: null },
                tDepth1: { value: null },
                tDepth2: { value: null }
            },
            vertexShader,
            fragmentShader,
            blending: NoBlending,
            depthWrite: false,
            depthTest: false
        });
    }
}
