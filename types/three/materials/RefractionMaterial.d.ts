import { RawShaderMaterial } from 'three';

import type { ColorRepresentation } from 'three';

export interface RefractionMaterialOptions {
    samples: number;
    backfaceAmount: number;
    magnify: number;
    iorR: number;
    iorG: number;
    iorB: number;
    saturation: number;
    refractPower: number;
    refractIntensity: number;
    fresnelPower: number;
    fresnelColor: ColorRepresentation;
}

/**
 * A multiside refraction material.
 */
export class RefractionMaterial extends RawShaderMaterial {
    constructor(options?: Partial<RefractionMaterialOptions>);
}
