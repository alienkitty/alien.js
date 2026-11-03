import { BackSide, GLSL3, RawShaderMaterial } from 'three';

// eslint-disable-next-line sort-imports
import { vertexShader, fragmentShader } from '../../shaders/RefractionBackfaceShader.js';

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
