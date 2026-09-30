import { RawShaderMaterial } from 'three';

import type { Texture } from 'three';

export interface ReflectorDudvMaterialOptions {
    map: Texture | null;
    reflectivity: number;
    dithering: boolean;
}

/**
 * A reflection material with DuDv map.
 */
export class ReflectorDudvMaterial extends RawShaderMaterial {
    constructor(options?: Partial<ReflectorDudvMaterialOptions>);
}
