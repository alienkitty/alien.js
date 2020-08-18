import { NoBlending, RawShaderMaterial, Uniform, Vector2 } from 'three';

import vertexShader from '../shaders/PoissonDiscBlurPass.vert.js';
import fragmentShader from '../shaders/PoissonDiscBlurPass.frag.js';

export class PoissonDiscBlurMaterial extends RawShaderMaterial {
    constructor() {
        super({
            uniforms: {
                tMap: new Uniform(null),
                uRadius: new Uniform(42),
                uResolution: new Uniform(new Vector2()),
                uTime: new Uniform(0)
            },
            vertexShader,
            fragmentShader,
            blending: NoBlending,
            depthWrite: false,
            depthTest: false
        });
    }
}
