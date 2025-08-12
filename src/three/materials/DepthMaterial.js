import { GLSL3, RawShaderMaterial } from 'three';

// eslint-disable-next-line sort-imports
import { vertexShader, fragmentShader } from '../../shaders/DepthShader.js';

/**
 * A depth material with dithering and instancing support.
 */
export class DepthMaterial extends RawShaderMaterial {
    constructor({
        dithering = false,
        instancing = false
    } = {}) {
        super({
            glslVersion: GLSL3,
            defines: {
                DITHERING: dithering,
                USE_INSTANCING: instancing
            },
            vertexShader,
            fragmentShader
        });
    }
}
