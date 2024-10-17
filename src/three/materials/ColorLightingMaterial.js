import { Color, GLSL3, RawShaderMaterial, Vector3 } from 'three';

import { vertexShader, fragmentShader } from '../../shaders/ColorLightingShader.js';

/**
 * A basic color material with position-based lighting,
 * alpha parameter and instancing support.
 */
export class ColorLightingMaterial extends RawShaderMaterial {
    constructor({
        color,
        instancing = false
    } = {}) {
        const parameters = {
            glslVersion: GLSL3,
            defines: {
            },
            uniforms: {
                uColor: { value: color instanceof Color ? color : new Color(color) },
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
