import { RawShaderMaterial } from 'three';

import type { Texture } from 'three';

export interface ShadowTextureMaterialOptions {
    map: Texture | null;
}

/**
 * A basic texture map material with alpha parameter,
 * that uses the green channel of the texture as the shadow.
 */
export class ShadowTextureMaterial extends RawShaderMaterial {
    constructor(options?: Partial<ShadowTextureMaterialOptions>);
}
