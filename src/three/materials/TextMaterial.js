import { Color, GLSL3, RawShaderMaterial } from 'three';

import { vertexShader, fragmentShader } from '../../shaders/TextShader.js';

/**
 * An MSDF (Multichannel Signed Distance Fields) text material,
 * with color and alpha parameters.
 */
export class TextMaterial extends RawShaderMaterial {
    constructor({
        map = null,
        color
    } = {}) {
        super({
            glslVersion: GLSL3,
            uniforms: {
                tMap: { value: map },
                uColor: { value: color instanceof Color ? color : new Color(color) },
                uAlpha: { value: 1 }
            },
            vertexShader,
            fragmentShader,
            transparent: true
        });
    }
}
