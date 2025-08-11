import { GLSL3, RawShaderMaterial } from 'three';

// eslint-disable-next-line sort-imports
import { vertexShader, fragmentShader } from '../../shaders/ShadowTextureShader.js';

/**
 * A basic texture map material with alpha parameter,
 * that uses the green channel of the texture as the shadow.
 */
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
