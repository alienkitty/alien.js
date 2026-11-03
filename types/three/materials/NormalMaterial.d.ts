import { RawShaderMaterial } from 'three';

export interface NormalMaterialOptions {
    instancing: boolean;
}

/**
 * A normal vectors material.
 */
export class NormalMaterial extends RawShaderMaterial {
    constructor(options?: Partial<NormalMaterialOptions>);
}
