import { GLSL3, NoBlending, RawShaderMaterial } from 'three';

// eslint-disable-next-line sort-imports
import { vertexShader, fragmentShader } from '../../shaders/SceneCompositeShader.js';

export class SceneCompositeMaterial extends RawShaderMaterial {
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
                tBloom: { value: null }
            },
            vertexShader,
            fragmentShader,
            blending: NoBlending,
            depthTest: false,
            depthWrite: false
        });
    }
}
