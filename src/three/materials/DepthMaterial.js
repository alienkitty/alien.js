import { GLSL3, RawShaderMaterial } from 'three';

import { vertexShader, fragmentShader } from '../../shaders/DepthShader.js';

export class DepthMaterial extends RawShaderMaterial {
    constructor() {
        super({
            glslVersion: GLSL3,
            vertexShader,
            fragmentShader
        });
    }
}
