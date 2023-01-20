import { GLSL3, NoBlending, RawShaderMaterial, Vector2 } from 'three';

import vertexShader from '../shaders/UnrealBloomBlurPass.vert.js';
import fragmentShader from '../shaders/UnrealBloomBlurPass.frag.js';

export class UnrealBloomBlurMaterial extends RawShaderMaterial {
    constructor(kernelRadius) {
        super({
            glslVersion: GLSL3,
            defines: {
                KERNEL_RADIUS: kernelRadius,
                SIGMA: kernelRadius
            },
            uniforms: {
                tMap: { value: null },
                uDirection: { value: new Vector2(0.5, 0.5) },
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
