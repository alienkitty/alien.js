import { RawShaderMaterial } from 'three';

export interface DepthMaterialOptions {
    dithering: boolean;
    instancing: boolean;
}

/**
 * A depth material with dithering and instancing support.
 */
export class DepthMaterial extends RawShaderMaterial {
    constructor(options?: Partial<DepthMaterialOptions>);
}
