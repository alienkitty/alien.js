import { GLSL3, NoBlending, RawShaderMaterial, Uniform, Vector2 } from 'three';

import vertexShader from '../shaders/VolumetricLightLensflarePass.vert.js';
import fragmentShader from '../shaders/VolumetricLightLensflarePass.frag.js';

export class VolumetricLightLensflareMaterial extends RawShaderMaterial {
    constructor() {
        super({
            glslVersion: GLSL3,
            uniforms: {
                tMap: new Uniform(null),
                uLightPosition: new Uniform(new Vector2(0.5, 0.5)),
                uScale: new Uniform(new Vector2(1, 1)),
                uSwizzle: new Uniform(0),
                uExposure: new Uniform(0.6),
                uDecay: new Uniform(0.93),
                uDensity: new Uniform(0.96),
                uWeight: new Uniform(0.4),
                uClamp: new Uniform(1),
                uLensflareScale: new Uniform(new Vector2(1.5, 1.5)),
                uLensflareExposure: new Uniform(1),
                uLensflareClamp: new Uniform(1),
                uResolution: new Uniform(new Vector2())
            },
            vertexShader,
            fragmentShader,
            blending: NoBlending,
            depthWrite: false,
            depthTest: false
        });
    }
}
