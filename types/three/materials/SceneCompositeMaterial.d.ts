import { RawShaderMaterial } from 'three';

export interface SceneCompositeMaterialOptions {
    dithering: boolean;
}

/**
 * A composite pass material for a scene with bloom added.
 */
export class SceneCompositeMaterial extends RawShaderMaterial {
    constructor(options?: Partial<SceneCompositeMaterialOptions>);
}
