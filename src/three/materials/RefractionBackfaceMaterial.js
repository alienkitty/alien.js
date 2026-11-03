import { BackSide, GLSL3, RawShaderMaterial } from 'three';

// eslint-disable-next-line sort-imports
import { vertexShader, fragmentShader } from '../../shaders/RefractionBackfaceShader.js';

/**
 * A refraction backface material.
 */
export class RefractionBackfaceMaterial extends RawShaderMaterial {
    constructor() {
        super({
            glslVersion: GLSL3,
            vertexShader,
            fragmentShader,
            side: BackSide
        });
    }
}
