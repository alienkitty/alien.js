import { Color, GLSL3, RawShaderMaterial } from 'three';

// eslint-disable-next-line sort-imports
import { vertexShader, fragmentShader } from '../../shaders/ColorShader.js';

/**
 * A basic color material with alpha parameter and instancing support.
 */
export class ColorMaterial extends RawShaderMaterial {
    constructor({
        color,
        instancing = false
    } = {}) {
        super({
            glslVersion: GLSL3,
            defines: {
                USE_INSTANCING: instancing
            },
            uniforms: {
                uColor: { value: color instanceof Color ? color : new Color(color) },
                uAlpha: { value: 1 }
            },
            vertexShader,
            fragmentShader
        });
    }
}
