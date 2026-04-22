import { Color, GLSL3, RawShaderMaterial, Vector2 } from 'three';

// eslint-disable-next-line sort-imports
import { vertexShader, fragmentShader } from '../../shaders/RefractionShader.js';

/**
 * A refraction material.
 */
export class RefractionMaterial extends RawShaderMaterial {
    constructor({
        map = null,
        fresnelColor
    } = {}) {
        super({
            glslVersion: GLSL3,
            uniforms: {
                tMap: { value: map },
                tBackfaceMap: { value: null },
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
