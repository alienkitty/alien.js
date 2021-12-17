import { Color, GLSL3, RawShaderMaterial, Uniform } from 'three';

import vertexShader from '../shaders/FresnelMaterial.vert.js';
import fragmentShader from '../shaders/FresnelMaterial.frag.js';

export class FresnelMaterial extends RawShaderMaterial {
    constructor({
        baseColor,
        fresnelColor,
        fresnelPower = 1.5
    } = {}) {
        super({
            glslVersion: GLSL3,
            uniforms: {
                uBaseColor: new Uniform(baseColor instanceof Color ? baseColor : new Color(baseColor)),
                uFresnelColor: new Uniform(fresnelColor instanceof Color ? fresnelColor : new Color(fresnelColor)),
                uFresnelPower: new Uniform(fresnelPower)
            },
            vertexShader,
            fragmentShader
        });
    }
}
