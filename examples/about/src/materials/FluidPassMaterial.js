import { NoBlending, RawShaderMaterial, Uniform } from 'three';

import { Global } from '../config/Global.js';
import { WorldController } from '../controllers/world/WorldController.js';

import vertexShader from '../shaders/FluidPass.vert.js';
import fragmentShader from '../shaders/FluidPass.frag.js';

export class FluidPassMaterial extends RawShaderMaterial {
    constructor() {
        super({
            type: 'FluidPassMaterial',
            defines: {
                NUM_POINTERS: Global.NUM_POINTERS,
                MAX_ITERATIONS: '5.0'
            },
            uniforms: {
                tMap: new Uniform(null),
                uMouse: new Uniform([]),
                uLast: new Uniform([]),
                uVelocity: new Uniform([]),
                uStrength: new Uniform([]),
                uFrame: WorldController.frame,
                uResolution: WorldController.resolution
            },
            vertexShader,
            fragmentShader,
            blending: NoBlending,
            depthWrite: false,
            depthTest: false
        });
    }
}
