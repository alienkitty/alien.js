import { AdditiveBlending, GLSL3, RawShaderMaterial, Vector2 } from 'three';

import vertexShader from '../shaders/LensflarePass.vert.js';
import fragmentShader from '../shaders/LensflarePass.frag.js';

export class LensflareMaterial extends RawShaderMaterial {
    constructor() {
        super({
            glslVersion: GLSL3,
            uniforms: {
                tMap: { value: null },
                uLightPosition: { value: new Vector2(0.5, 0.5) },
                uScale: { value: new Vector2(1.5, 1.5) },
                uExposure: { value: 1 },
                uClamp: { value: 1 },
                uResolution: { value: new Vector2() }
            },
            vertexShader,
            fragmentShader,
            blending: AdditiveBlending,
            depthWrite: false,
            depthTest: false
        });
    }
}
