import { GLSL3, NoBlending, RawShaderMaterial, Uniform, Vector2 } from 'three';

import vertexShader from '../shaders/VolumetricLightPass.vert.js';
import fragmentShader from '../shaders/VolumetricLightPass.frag.js';

export class VolumetricLightMaterial extends RawShaderMaterial {
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
                uClamp: new Uniform(1)
            },
            vertexShader,
            fragmentShader,
            blending: NoBlending,
            depthWrite: false,
            depthTest: false
        });
    }
}
