import { GLSL3, NoBlending, RawShaderMaterial } from 'three';

import vertexShader from '../shaders/FlowPass.vert.js';
import fragmentShader from '../shaders/FlowPass.frag.js';

export class FlowMaterial extends RawShaderMaterial {
    constructor() {
        super({
            glslVersion: GLSL3,
            uniforms: {
                tMap: { value: null },
                tFlow: { value: null }
            },
            vertexShader,
            fragmentShader,
            blending: NoBlending,
            depthWrite: false,
            depthTest: false
        });
    }
}
