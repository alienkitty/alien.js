import { GLSL3, NoBlending, RawShaderMaterial } from 'three';

import { vertexShader, fragmentShader } from '../../shaders/SceneCompositeDistortionShader.js';

/**
 * A composite pass material for a scene with distorted bloom added,
 * and distortion parameter.
 */
export class SceneCompositeDistortionMaterial extends RawShaderMaterial {
    constructor({
        dithering = false
    } = {}) {
        super({
            glslVersion: GLSL3,
            defines: {
                DITHERING: dithering
            },
            uniforms: {
                tScene: { value: null },
                tBloom: { value: null },
                uBloomDistortion: { value: 1.5 }
            },
            vertexShader,
            fragmentShader,
            blending: NoBlending,
            depthTest: false,
            depthWrite: false
        });
    }
}
