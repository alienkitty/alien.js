import { GLSL3, NoBlending, RawShaderMaterial, Uniform } from 'three';

import vertexShader from '../shaders/DepthMaskPass.vert.js';
import fragmentShader from '../shaders/DepthMaskPass.frag.js';

export class DepthMaskMaterial extends RawShaderMaterial {
    constructor() {
        super({
            glslVersion: GLSL3,
            uniforms: {
                tMap: new Uniform(null),
                tDepth1: new Uniform(null),
                tDepth2: new Uniform(null)
            },
            vertexShader,
            fragmentShader,
            blending: NoBlending,
            depthWrite: false,
            depthTest: false
        });
    }
}
