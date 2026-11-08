import { RawShaderMaterial, Vector3 } from 'three';

import type { ColorRepresentation } from 'three';

export interface ColorLightingMaterialOptions {
    color: ColorRepresentation;
    lightPosition: Vector3;
    lightIntensity: number;
    instancing: boolean;
}

/**
 * A basic color material with position-based lighting,
 * intensity and alpha parameters plus instancing support.
 */
export class ColorLightingMaterial extends RawShaderMaterial {
    constructor(options?: Partial<ColorLightingMaterialOptions>);
}
