import { GLSL3, NoBlending, RawShaderMaterial } from 'three';

// eslint-disable-next-line sort-imports
import { vertexShader, fragmentShader } from '../../shaders/DiscardShader.js';

/**
 * A discard material with instancing support.
 */
export class DiscardMaterial extends RawShaderMaterial {
    constructor({
        instancing = false
    } = {}) {
        super({
            glslVersion: GLSL3,
            defines: {
                USE_INSTANCING: instancing
            },
            vertexShader,
            fragmentShader,
            blending: NoBlending,
            depthTest: false,
            depthWrite: false
        });
    }
}
