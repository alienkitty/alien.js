import { GLSL3, NearestFilter, NoBlending, RawShaderMaterial, RepeatWrapping, TextureLoader, Vector2 } from 'three';

import { vertexShader, fragmentShader } from '../../shaders/MotionBlurCompositeShader.js';

export class MotionBlurCompositeMaterial extends RawShaderMaterial {
    constructor(loader = new TextureLoader(), {
        samples = 7,
        blueNoisePath = 'assets/textures/blue_noise.png',
        blueNoiseResolution = new Vector2(256, 256)
    } = {}) {
        const texture = loader.load(blueNoisePath);
        texture.wrapS = RepeatWrapping;
        texture.wrapT = RepeatWrapping;
        texture.magFilter = NearestFilter;
        texture.minFilter = NearestFilter;
        texture.generateMipmaps = false;

        super({
            glslVersion: GLSL3,
            defines: {
                SAMPLES: samples
            },
            uniforms: {
                tMap: { value: null },
                tVelocity: { value: null },
                tBlueNoise: { value: texture },
                uBlueNoiseResolution: { value: blueNoiseResolution }
            },
            vertexShader,
            fragmentShader,
            blending: NoBlending,
            depthTest: false,
            depthWrite: false
        });
    }
}
