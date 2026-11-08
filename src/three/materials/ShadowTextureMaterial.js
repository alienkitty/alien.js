import { GLSL3, RawShaderMaterial } from 'three';

// eslint-disable-next-line sort-imports
import { vertexShader, fragmentShader } from '../../shaders/ShadowTextureShader.js';

export class ShadowTextureMaterial extends RawShaderMaterial {
    constructor({
        map = null
    } = {}) {
        super({
            glslVersion: GLSL3,
            uniforms: {
                tMap: { value: map },
                uAlpha: { value: 1 }
            },
            vertexShader,
            fragmentShader,
            transparent: true
        });
    }
}
