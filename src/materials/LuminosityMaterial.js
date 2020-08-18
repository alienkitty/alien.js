// Based on {@link module:three/examples/jsm/shaders/LuminosityHighPassShader.js} by bhouston

import { Color, NoBlending, RawShaderMaterial, Uniform } from 'three';

import vertexShader from '../shaders/LuminosityPass.vert.js';
import fragmentShader from '../shaders/LuminosityPass.frag.js';

export class LuminosityMaterial extends RawShaderMaterial {
    constructor() {
        super({
            uniforms: {
                tMap: new Uniform(null),
                uLuminosityThreshold: new Uniform(1),
                uSmoothWidth: new Uniform(1),
                uDefaultColor: new Uniform(new Color(0x000000)),
                uDefaultOpacity: new Uniform(0)
            },
            vertexShader,
            fragmentShader,
            blending: NoBlending,
            depthWrite: false,
            depthTest: false
        });
    }
}
