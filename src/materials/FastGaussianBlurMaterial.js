import { NoBlending, RawShaderMaterial, Uniform, Vector2 } from 'three';

import vertexShader from '../shaders/FastGaussianBlurPass.vert.js';
import fragmentShader from '../shaders/FastGaussianBlurPass.frag.js';

export class FastGaussianBlurMaterial extends RawShaderMaterial {
    constructor() {
        super({
            uniforms: {
                tMap: new Uniform(null),
                uDirection: new Uniform(new Vector2(1, 0)),
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
