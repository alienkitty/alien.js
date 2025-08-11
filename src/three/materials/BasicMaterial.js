import { GLSL3, Matrix3, RawShaderMaterial } from 'three';

// eslint-disable-next-line sort-imports
import { vertexShader, fragmentShader } from '../../shaders/BasicShader.js';

/**
 * A basic texture map material with alpha parameter and instancing support.
 */
export class BasicMaterial extends RawShaderMaterial {
    constructor({
        map = null,
        instancing = false
    } = {}) {
        const parameters = {
            glslVersion: GLSL3,
            defines: {
            },
            uniforms: {
                tMap: { value: null },
                uMapTransform: { value: new Matrix3() },
                uAlpha: { value: 1 }
            },
            vertexShader,
            fragmentShader,
            transparent: true
        };

        if (map) {
            map.updateMatrix();

            parameters.uniforms = Object.assign(parameters.uniforms, {
                tMap: { value: map },
                uMapTransform: { value: map.matrix }
            });
        }

        if (instancing) {
            parameters.defines = Object.assign(parameters.defines, {
                USE_INSTANCING: ''
            });
        }

        super(parameters);
    }
}
