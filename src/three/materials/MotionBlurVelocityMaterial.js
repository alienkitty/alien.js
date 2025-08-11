import { GLSL3, Matrix4, RawShaderMaterial } from 'three';

// eslint-disable-next-line sort-imports
import { vertexShader, fragmentShader } from '../../shaders/MotionBlurVelocityShader.js';

/**
 * A velocity pass material with instancing support.
 */
export class MotionBlurVelocityMaterial extends RawShaderMaterial {
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
