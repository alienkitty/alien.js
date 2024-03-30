import { GLSL3, Matrix4, RawShaderMaterial } from 'three';

import { vertexShader, fragmentShader } from '../../shaders/MotionBlurVelocityShader.js';

export class MotionBlurVelocityMaterial extends RawShaderMaterial {
    constructor() {
        super({
            glslVersion: GLSL3,
            uniforms: {
                prevProjectionMatrix: { value: new Matrix4() },
                prevModelViewMatrix: { value: new Matrix4() },
                expandGeometry: { value: 0 },
                interpolateGeometry: { value: 1 },
                smearIntensity: { value: 1 }
            },
            vertexShader,
            fragmentShader
        });
    }
}
