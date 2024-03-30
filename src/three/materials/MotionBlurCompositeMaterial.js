import { GLSL3, NoBlending, RawShaderMaterial } from 'three';

import { vertexShader, fragmentShader } from '../../shaders/MotionBlurCompositeShader.js';

export class MotionBlurCompositeMaterial extends RawShaderMaterial {
    constructor() {
        super({
            glslVersion: GLSL3,
            defines: {
                SAMPLES: 30
            },
            uniforms: {
                sourceBuffer: { value: null },
                velocityBuffer: { value: null }
            },
            vertexShader,
            fragmentShader,
            blending: NoBlending,
            depthTest: false,
            depthWrite: false
        });
    }
}
