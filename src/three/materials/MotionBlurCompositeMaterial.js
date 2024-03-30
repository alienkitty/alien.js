import { GLSL3, NoBlending, RawShaderMaterial } from 'three';

import { vertexShader, fragmentShader } from '../../shaders/MotionBlurCompositeShader.js';

export class MotionBlurCompositeMaterial extends RawShaderMaterial {
    constructor(samples) {
        super({
            glslVersion: GLSL3,
            defines: {
                SAMPLES: samples
            },
            uniforms: {
                tMap: { value: null },
                tVelocity: { value: null }
            },
            vertexShader,
            fragmentShader,
            blending: NoBlending,
            depthTest: false,
            depthWrite: false
        });
    }
}
