import { GLSL3, RawShaderMaterial } from 'three';

// eslint-disable-next-line sort-imports
import { vertexShader, fragmentShader } from '../../shaders/NormalShader.js';

/**
 * A normal vectors material.
 */
export class NormalMaterial extends RawShaderMaterial {
    constructor({
        instancing = false
    } = {}) {
        super({
            glslVersion: GLSL3,
            defines: {
                USE_INSTANCING: instancing
            },
            vertexShader,
            fragmentShader
        });
    }
}
