import { RawShaderMaterial } from 'three';

import type { ColorRepresentation } from 'three';

export interface FresnelMaterialOptions {
    baseColor: ColorRepresentation;
    fresnelColor: ColorRepresentation;
    fresnelPower: number;
    instancing: boolean;
}

/**
 * A Fresnel material with instancing support.
 */
export class FresnelMaterial extends RawShaderMaterial {
    constructor(options?: Partial<FresnelMaterialOptions>);
}
