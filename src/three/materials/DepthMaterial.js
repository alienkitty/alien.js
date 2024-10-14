import { GLSL3, RawShaderMaterial } from 'three';

import { vertexShader, fragmentShader } from '../../shaders/DepthShader.js';

export class DepthMaterial extends RawShaderMaterial {
    constructor({
        dithering = false,
        instancing = false
    } = {}) {
        const parameters = {
            glslVersion: GLSL3,
            defines: {
                DITHERING: dithering
            },
            vertexShader,
            fragmentShader
        };

        if (instancing) {
            parameters.defines = Object.assign(parameters.defines, {
                USE_INSTANCING: ''
            });
        }

        super(parameters);
    }
}
