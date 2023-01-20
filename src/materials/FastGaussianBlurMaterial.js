import { GLSL3, NoBlending, RawShaderMaterial, Vector2 } from 'three';

import vertexShader from '../shaders/FastGaussianBlurPass.vert.js';
import fragmentShader from '../shaders/FastGaussianBlurPass.frag.js';

export class FastGaussianBlurMaterial extends RawShaderMaterial {
    constructor() {
        super({
            glslVersion: GLSL3,
            uniforms: {
                tMap: { value: null },
                uDirection: { value: new Vector2(1, 0) },
                uResolution: { value: new Vector2() }
            },
            vertexShader,
            fragmentShader,
            blending: NoBlending,
            depthWrite: false,
            depthTest: false
        });
    }
}
