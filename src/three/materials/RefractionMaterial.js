import { Color, GLSL3, RawShaderMaterial, Vector2 } from 'three';

// eslint-disable-next-line sort-imports
import { vertexShader, fragmentShader } from '../../shaders/RefractionShader.js';

/**
 * A multiside refraction material.
 */
export class RefractionMaterial extends RawShaderMaterial {
    constructor({
        samples = 16,
        backfaceAmount = 0.33,
        magnify = 1,
        iorR = 1.5,
        iorG = 1.5,
        iorB = 1.5,
        saturation = 1.06,
        refractPower = 0.4,
        refractIntensity = 0.5,
        fresnelPower = 3,
        fresnelColor
    } = {}) {
        super({
            glslVersion: GLSL3,
            defines: {
                NUM_SAMPLES: samples
            },
            uniforms: {
                tMap: { value: null },
                tBackfaceMap: { value: null },
                uBackfaceAmount: { value: backfaceAmount },
                uMagnify: { value: magnify },
                uIorR: { value: iorR },
                uIorG: { value: iorG },
                uIorB: { value: iorB },
                uSaturation: { value: saturation },
                uRefractPower: { value: refractPower },
                uRefractIntensity: { value: refractIntensity },
                uFresnelPower: { value: fresnelPower },
                uFresnelColor: { value: fresnelColor instanceof Color ? fresnelColor : new Color(fresnelColor) },
                uAlpha: { value: 1 },
                uResolution: { value: new Vector2() }
            },
            vertexShader,
            fragmentShader,
            transparent: true
        });
    }
}
