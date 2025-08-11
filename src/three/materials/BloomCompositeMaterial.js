import { GLSL3, NoBlending, RawShaderMaterial } from 'three';

// eslint-disable-next-line sort-imports
import { vertexShader, fragmentShader } from '../../shaders/BloomCompositeShader.js';

/**
 * A bloom composite pass material based on the bloom from Unreal Engine.
 */
export class BloomCompositeMaterial extends RawShaderMaterial {
    constructor({
        dithering = false
    } = {}) {
        super({
            glslVersion: GLSL3,
            defines: {
                NUM_MIPS: 5,
                DITHERING: dithering
            },
            uniforms: {
                tBlur1: { value: null },
                tBlur2: { value: null },
                tBlur3: { value: null },
                tBlur4: { value: null },
                tBlur5: { value: null },
                uBloomFactors: { value: null }
            },
            vertexShader,
            fragmentShader,
            blending: NoBlending,
            depthTest: false,
            depthWrite: false
        });
    }
}
