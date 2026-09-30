import { RawShaderMaterial } from 'three';

export interface SceneCompositeAddMaterialOptions {
    dithering: boolean;
}

/**
 * A composite pass material for a scene with bloom and additional texture added.
 */
export class SceneCompositeAddMaterial extends RawShaderMaterial {
    constructor(options?: Partial<SceneCompositeAddMaterialOptions>);
}
