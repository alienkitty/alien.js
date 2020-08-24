import { NearestFilter, NoBlending, RawShaderMaterial, RepeatWrapping, Uniform, Vector2 } from 'three';

import { TextureLoader } from '../loaders/TextureLoader.js';

import vertexShader from '../shaders/PoissonDiscBlurPass.vert.js';
import fragmentShader from '../shaders/PoissonDiscBlurPass.frag.js';

export class PoissonDiscBlurMaterial extends RawShaderMaterial {
    constructor() {
        const texture = new TextureLoader().load('assets/textures/blue_noise.png');
        texture.wrapS = RepeatWrapping;
        texture.wrapT = RepeatWrapping;
        texture.magFilter = NearestFilter;
        texture.minFilter = NearestFilter;
        texture.generateMipmaps = false;

        super({
            uniforms: {
                tMap: new Uniform(null),
                tBlueNoise: new Uniform(texture),
                uBlueNoiseTexelSize: new Uniform(new Vector2(1 / 256, 1 / 256)),
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
