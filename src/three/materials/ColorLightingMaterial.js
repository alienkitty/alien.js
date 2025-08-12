import { Color, GLSL3, RawShaderMaterial, Vector3 } from 'three';

// eslint-disable-next-line sort-imports
import { vertexShader, fragmentShader } from '../../shaders/ColorLightingShader.js';

/**
 * A basic color material with position-based lighting,
 * intensity and alpha parameters plus instancing support.
 */
export class ColorLightingMaterial extends RawShaderMaterial {
    constructor({
        color,
        lightPosition = new Vector3(1, 1, 1),
        lightIntensity = 0.25,
        instancing = false
    } = {}) {
        super({
            glslVersion: GLSL3,
            defines: {
                USE_INSTANCING: instancing
            },
            uniforms: {
                uColor: { value: color instanceof Color ? color : new Color(color) },
                uLightPosition: { value: lightPosition },
                uLightIntensity: { value: lightIntensity },
                uAlpha: { value: 1 }
            },
            vertexShader,
            fragmentShader,
            transparent: true
        });
    }
}
