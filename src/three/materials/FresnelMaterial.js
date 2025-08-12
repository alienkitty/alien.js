import { Color, GLSL3, RawShaderMaterial } from 'three';

// eslint-disable-next-line sort-imports
import { vertexShader, fragmentShader } from '../../shaders/FresnelShader.js';

/**
 * A Fresnel material with instancing support.
 */
export class FresnelMaterial extends RawShaderMaterial {
    constructor({
        baseColor,
        fresnelColor,
        fresnelPower = 1.5,
        instancing = false
    } = {}) {
        super({
            glslVersion: GLSL3,
            defines: {
                USE_INSTANCING: instancing
            },
            uniforms: {
                uBaseColor: { value: baseColor instanceof Color ? baseColor : new Color(baseColor) },
                uFresnelColor: { value: fresnelColor instanceof Color ? fresnelColor : new Color(fresnelColor) },
                uFresnelPower: { value: fresnelPower }
            },
            vertexShader,
            fragmentShader
        });
    }
}
