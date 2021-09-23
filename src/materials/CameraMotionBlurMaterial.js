import { GLSL3, Matrix4, NoBlending, RawShaderMaterial, Uniform, Vector3 } from 'three';

import vertexShader from '../shaders/CameraMotionBlurPass.vert.js';
import fragmentShader from '../shaders/CameraMotionBlurPass.frag.js';

export class CameraMotionBlurMaterial extends RawShaderMaterial {
    constructor() {
        super({
            glslVersion: GLSL3,
            uniforms: {
                tMap: new Uniform(null),
                tDepth: new Uniform(null),
                uVelocityFactor: new Uniform(1),
                uDelta: new Uniform(16.67),
                uClipToWorldMatrix: new Uniform(new Matrix4()),
                uWorldToClipMatrix: new Uniform(new Matrix4()),
                uPreviousWorldToClipMatrix: new Uniform(new Matrix4()),
                uCameraMove: new Uniform(new Vector3())
            },
            vertexShader,
            fragmentShader,
            blending: NoBlending,
            depthWrite: false,
            depthTest: false
        });
    }
}
