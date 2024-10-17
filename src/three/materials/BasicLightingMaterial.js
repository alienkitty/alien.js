import { GLSL3, RawShaderMaterial, Vector3 } from 'three';

import { vertexShader, fragmentShader } from '../../shaders/BasicLightingShader.js';

/**
 * A basic texture map material with position-based lighting,
 * alpha parameter and instancing support.
 */
export class BasicLightingMaterial extends RawShaderMaterial {
    constructor({
        map = null,
        instancing = false
    } = {}) {
        const parameters = {
            glslVersion: GLSL3,
            defines: {
            },
            uniforms: {
                tMap: { value: map },
                uLightPosition: { value: new Vector3(0.5, 1.0, -0.3) },
                uAlpha: { value: 1 }
            },
            vertexShader,
            fragmentShader,
            transparent: true
        };

        if (instancing) {
            parameters.defines = Object.assign(parameters.defines, {
                USE_INSTANCING: ''
            });
        }

        super(parameters);
    }
}
