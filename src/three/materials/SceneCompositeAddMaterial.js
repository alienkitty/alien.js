import { GLSL3, NoBlending, RawShaderMaterial } from 'three';

import { vertexShader, fragmentShader } from '../../shaders/SceneCompositeAddShader.js';

export class SceneCompositeAddMaterial extends RawShaderMaterial {
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
                tAdd: { value: null }
            },
            vertexShader,
            fragmentShader,
            blending: NoBlending,
            depthTest: false,
            depthWrite: false
        });
    }
}
