import { GLSL3, Matrix4, NoBlending, RawShaderMaterial, Vector3 } from 'three';

import vertexShader from '../shaders/CameraMotionBlurPass.vert.js';
import fragmentShader from '../shaders/CameraMotionBlurPass.frag.js';

export class CameraMotionBlurMaterial extends RawShaderMaterial {
    constructor() {
        super({
            glslVersion: GLSL3,
            uniforms: {
                tMap: { value: null },
                tDepth: { value: null },
                uVelocityFactor: { value: 1 },
                uDelta: { value: 16.67 },
                uClipToWorldMatrix: { value: new Matrix4() },
                uWorldToClipMatrix: { value: new Matrix4() },
                uPreviousWorldToClipMatrix: { value: new Matrix4() },
                uCameraMove: { value: new Vector3() }
            },
            vertexShader,
            fragmentShader,
            blending: NoBlending,
            depthWrite: false,
            depthTest: false
        });
    }
}
