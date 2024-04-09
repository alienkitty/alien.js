import { GLSL3, Matrix4, RawShaderMaterial } from 'three';

import { vertexShader, fragmentShader } from '../../shaders/MotionBlurVelocityShader.js';

export class MotionBlurVelocityMaterial extends RawShaderMaterial {
    constructor() {
        super({
            glslVersion: GLSL3,
            uniforms: {
                uPrevModelViewMatrix: { value: new Matrix4() },
                uPrevProjectionMatrix: { value: new Matrix4() },
                uInterpolateGeometry: { value: 0 },
                uIntensity: { value: 1 }
            },
            vertexShader,
            fragmentShader
        });
    }
}
