import { GLSL3, Matrix4, RawShaderMaterial } from 'three';

import { vertexShader, fragmentShader } from '../../shaders/DrawBuffersShader.js';

/**
 * A draw buffers pass material with instancing support.
 */
export class DrawBuffersMaterial extends RawShaderMaterial {
    constructor({
        instancing = false
    } = {}) {
        const parameters = {
            glslVersion: GLSL3,
            defines: {
            },
            uniforms: {
                uPrevModelViewMatrix: { value: new Matrix4() },
                uPrevProjectionMatrix: { value: new Matrix4() },
                uInterpolateGeometry: { value: 1 },
                uSmearIntensity: { value: 1 }
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
