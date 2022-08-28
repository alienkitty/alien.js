import { GLSL3, NearestFilter, NoBlending, RawShaderMaterial, RepeatWrapping, Uniform, Vector2 } from 'three';

import { TextureLoader } from '../loaders/world/TextureLoader.js';

import vertexShader from '../shaders/LensflarePass.vert.js';
import fragmentShader from '../shaders/LensflarePass.frag.js';

export class LensflareMaterial extends RawShaderMaterial {
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
                tMap: new Uniform(null),
                tBlueNoise: new Uniform(texture),
                uBlueNoiseResolution: new Uniform(new Vector2(256, 256)),
                uLightPosition: new Uniform(new Vector2(0.5, 0.5)),
                uScale: new Uniform(new Vector2(1, 1)),
                uSwizzle: new Uniform(0),
                uExposure: new Uniform(0.6),
                uDecay: new Uniform(0.93),
                uDensity: new Uniform(0.96),
                uWeight: new Uniform(0.4),
                uClamp: new Uniform(1),
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
