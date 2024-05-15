import { Color, GLSL3, RawShaderMaterial } from 'three';

import { vertexShader, fragmentShader } from '../../shaders/FresnelShader.js';

export class FresnelMaterial extends RawShaderMaterial {
    constructor({
        baseColor,
        fresnelColor,
        fresnelPower = 1.5,
        instancing = false
    } = {}) {
        const parameters = {
            glslVersion: GLSL3,
            defines: {
            },
            uniforms: {
                uBaseColor: { value: baseColor instanceof Color ? baseColor : new Color(baseColor) },
                uFresnelColor: { value: fresnelColor instanceof Color ? fresnelColor : new Color(fresnelColor) },
                uFresnelPower: { value: fresnelPower }
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
