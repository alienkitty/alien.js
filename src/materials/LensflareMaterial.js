import { AdditiveBlending, GLSL3, RawShaderMaterial, Uniform, Vector2 } from 'three';

import vertexShader from '../shaders/LensflarePass.vert.js';
import fragmentShader from '../shaders/LensflarePass.frag.js';

export class LensflareMaterial extends RawShaderMaterial {
    constructor() {
        super({
            glslVersion: GLSL3,
            uniforms: {
                tMap: new Uniform(null),
                uLightPosition: new Uniform(new Vector2(0.5, 0.5)),
                uScale: new Uniform(new Vector2(1.5, 1.5)),
                uExposure: new Uniform(1),
                uClamp: new Uniform(1),
                uResolution: new Uniform(new Vector2())
            },
            vertexShader,
            fragmentShader,
            blending: AdditiveBlending,
            depthWrite: false,
            depthTest: false
        });
    }
}
