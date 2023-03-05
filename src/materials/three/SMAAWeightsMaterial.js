import { GLSL3, LinearFilter, NearestFilter, NoBlending, RawShaderMaterial, TextureLoader, Uniform, Vector2 } from 'three';

import { vertexShader, fragmentShader } from '../../shaders/SMAAWeightsShader.js';

export class SMAAWeightsMaterial extends RawShaderMaterial {
    constructor({
        searchTexturePath = 'assets/textures/smaa/search.png',
        areaTexturePath = 'assets/textures/smaa/area.png'
    } = {}) {
        const searchTexture = new TextureLoader().load(searchTexturePath);
        searchTexture.magFilter = NearestFilter;
        searchTexture.minFilter = NearestFilter;
        searchTexture.generateMipmaps = false;
        searchTexture.flipY = true;

        const areaTexture = new TextureLoader().load(areaTexturePath);
        areaTexture.magFilter = LinearFilter;
        areaTexture.minFilter = LinearFilter;
        areaTexture.generateMipmaps = false;
        areaTexture.flipY = false;

        super({
            glslVersion: GLSL3,
            defines: {
                SMAA_MAX_SEARCH_STEPS: '8',
                SMAA_AREATEX_MAX_DISTANCE: '16',
                SMAA_AREATEX_PIXEL_SIZE: '(1.0 / vec2(160.0, 560.0))',
                SMAA_AREATEX_SUBTEX_SIZE: '(1.0 / 7.0)',
                SMAA_SEARCHTEX_SIZE: 'vec2(66.0, 33.0)',
                SMAA_SEARCHTEX_PACKED_SIZE: 'vec2(64.0, 16.0)'
            },
            uniforms: {
                tMap: new Uniform(null),
                tSearch: new Uniform(searchTexture),
                tArea: new Uniform(areaTexture),
                uResolution: new Uniform(new Vector2()),
                uTexelSize: new Uniform(new Vector2())
            },
            vertexShader,
            fragmentShader,
            blending: NoBlending,
            depthWrite: false,
            depthTest: false
        });
    }
}
