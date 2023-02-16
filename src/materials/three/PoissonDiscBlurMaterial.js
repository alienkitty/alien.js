import { GLSL3, NearestFilter, NoBlending, RawShaderMaterial, RepeatWrapping, Vector2 } from 'three';

import { TextureLoader } from '../../loaders/three/TextureLoader.js';

import { vertexShader, fragmentShader } from '../../shaders/PoissonDiscBlurShader.js';

export class PoissonDiscBlurMaterial extends RawShaderMaterial {
    constructor({
        blueNoisePath = 'assets/textures/blue_noise.png'
    } = {}) {
        const texture = new TextureLoader().load(blueNoisePath);
        texture.wrapS = RepeatWrapping;
        texture.wrapT = RepeatWrapping;
        texture.magFilter = NearestFilter;
        texture.minFilter = NearestFilter;
        texture.generateMipmaps = false;

        super({
            glslVersion: GLSL3,
            uniforms: {
                tMap: { value: null },
                tBlueNoise: { value: texture },
                uBlueNoiseResolution: { value: new Vector2(256, 256) },
                uRadius: { value: 42 },
                uResolution: { value: new Vector2() },
                uTime: { value: 0 }
            },
            vertexShader,
            fragmentShader,
            blending: NoBlending,
            depthWrite: false,
            depthTest: false
        });
    }
}
