import { GLSL3, NoBlending, RawShaderMaterial } from 'three';

import { vertexShader, fragmentShader } from '../../shaders/UnrealBloomCompositeShader.js';

/**
 * A bloom composite pass material based on the bloom from Unreal Engine.
 */
export class UnrealBloomCompositeMaterial extends RawShaderMaterial {
    constructor(nMips) {
        super({
            glslVersion: GLSL3,
            defines: {
                NUM_MIPS: nMips
            },
            uniforms: {
                tBlur1: { value: null },
                tBlur2: { value: null },
                tBlur3: { value: null },
                tBlur4: { value: null },
                tBlur5: { value: null },
                uBloomStrength: { value: 1 },
                uBloomRadius: { value: 0 },
                uBloomFactors: { value: null },
                uBloomTintColors: { value: null }
            },
            vertexShader,
            fragmentShader,
            blending: NoBlending,
            depthTest: false,
            depthWrite: false
        });
    }
}
