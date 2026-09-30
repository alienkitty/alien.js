import { RawShaderMaterial } from 'three';

export interface DiscardMaterialOptions {
    instancing: boolean;
}

/**
 * A discard material with instancing support.
 */
export class DiscardMaterial extends RawShaderMaterial {
    constructor(options?: Partial<DiscardMaterialOptions>);
}
