import { Color, GLSL3, RawShaderMaterial, Vector2 } from 'three';

// eslint-disable-next-line sort-imports
import { vertexShader, fragmentShader } from '../../shaders/PolylineShader.js';

/**
 * An instanced "fat" polyline material with alpha channel.
 *
 * @see {@link https://github.com/mrdoob/three.js/blob/dev/examples/jsm/lines/LineMaterial.js | three.js - LineMaterial Source}
 */
export class PolylineMaterial extends RawShaderMaterial {
    constructor({
        color,
        lineWidth = 1
    } = {}) {
        super({
            glslVersion: GLSL3,
            uniforms: {
                uColor: { value: color instanceof Color ? color : new Color(color) },
                uAlpha: { value: 1 },
                uLineWidth: { value: lineWidth },
                uResolution: { value: new Vector2() },
                uDPR: { value: 1 }
            },
            vertexShader,
            fragmentShader,
            transparent: true
        });
    }
}
