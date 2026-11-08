import { RawShaderMaterial } from 'three';

import type { Texture } from 'three';

export interface BasicMaterialOptions {
    map: Texture | null;
    instancing: boolean;
}

/**
 * A basic texture map material with alpha parameter and instancing support.
 */
export class BasicMaterial extends RawShaderMaterial {
    constructor(options?: Partial<BasicMaterialOptions>);
}
