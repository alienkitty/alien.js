import { GLSL3, Matrix4, RawShaderMaterial } from 'three';

// eslint-disable-next-line sort-imports
import { vertexShader, fragmentShader } from '../../shaders/MotionBlurVelocityShader.js';

/**
 * A velocity pass material with instancing support.
 */
export class MotionBlurVelocityMaterial extends RawShaderMaterial {
    constructor({
        cameraNear = null,
        cameraFar = null,
        instancing = false
    } = {}) {
        super({
            glslVersion: GLSL3,
            defines: {
                USE_CAMERA_DEPTH: cameraNear !== null && cameraFar !== null,
                USE_INSTANCING: instancing
            },
            uniforms: {
                uPrevModelViewMatrix: { value: new Matrix4() },
                uPrevProjectionMatrix: { value: new Matrix4() },
                uInterpolateGeometry: { value: 1 },
                uSmearIntensity: { value: 1 },
                uCameraNear: { value: cameraNear },
                uCameraFar: { value: cameraFar }
            },
            vertexShader,
            fragmentShader
        });
    }
}
