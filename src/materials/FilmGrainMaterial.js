import { NoBlending, RawShaderMaterial, Uniform } from 'three';

import vertexShader from '../shaders/FilmGrainPass.vert.js';
import fragmentShader from '../shaders/FilmGrainPass.frag.js';

export class FilmGrainMaterial extends RawShaderMaterial {
    constructor() {
        super({
            uniforms: {
                tMap: new Uniform(null),
                uIntensity: new Uniform(0.5),
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
