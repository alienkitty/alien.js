import { NearestFilter, NoBlending, RawShaderMaterial, RepeatWrapping, Uniform, Vector2 } from 'three';

import { TextureLoader } from '../loaders/world/TextureLoader.js';

import vertexShader from '../shaders/BloomCompositePass.vert.js';
import fragmentShader from '../shaders/BloomCompositePass.frag.js';

export class BloomCompositeMaterial extends RawShaderMaterial {
    constructor(nMips) {
        const texture = new TextureLoader().load('assets/textures/blue_noise.png');
        texture.wrapS = RepeatWrapping;
        texture.wrapT = RepeatWrapping;
        texture.magFilter = NearestFilter;
        texture.minFilter = NearestFilter;
        texture.generateMipmaps = false;

        super({
            defines: {
                NUM_MIPS: nMips
            },
            uniforms: {
                tBlur1: new Uniform(null),
                tBlur2: new Uniform(null),
                tBlur3: new Uniform(null),
                tBlur4: new Uniform(null),
                tBlur5: new Uniform(null),
                tBlueNoise: new Uniform(texture),
                uBlueNoiseTexelSize: new Uniform(new Vector2(1 / 256, 1 / 256)),
                uBloomFactors: new Uniform(null)
            },
            vertexShader,
            fragmentShader,
            blending: NoBlending,
            depthWrite: false,
            depthTest: false
        });
    }
}
