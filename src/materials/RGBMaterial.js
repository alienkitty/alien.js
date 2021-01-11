import { NoBlending, RawShaderMaterial, Uniform } from 'three';

import vertexShader from '../shaders/RGBPass.vert.js';
import fragmentShader from '../shaders/RGBPass.frag.js';

export class RGBMaterial extends RawShaderMaterial {
    constructor() {
        super({
            uniforms: {
                tMap: new Uniform(null),
                uAngle: new Uniform(0),
                uAmount: new Uniform(0.005)
            },
            vertexShader,
            fragmentShader,
            blending: NoBlending,
            depthWrite: false,
            depthTest: false
        });
    }
}
