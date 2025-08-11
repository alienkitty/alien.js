import { GLSL3, NoBlending, RawShaderMaterial, Vector2 } from 'three';

// eslint-disable-next-line sort-imports
import { vertexShader, fragmentShader } from '../../shaders/UnrealBloomBlurShader.js';

/**
 * A separable Gaussian blur pass material based on the bloom from Unreal Engine.
 */
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
            depthTest: false,
            depthWrite: false
        });
    }
}
