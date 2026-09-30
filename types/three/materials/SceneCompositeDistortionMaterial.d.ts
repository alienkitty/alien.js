import { RawShaderMaterial } from 'three';

export interface SceneCompositeDistortionMaterialOptions {
    dithering: boolean;
}

/**
 * A composite pass material for a scene with distorted bloom added,
 * and distortion parameter.
 */
export class SceneCompositeDistortionMaterial extends RawShaderMaterial {
    constructor(options?: Partial<SceneCompositeDistortionMaterialOptions>);
}
