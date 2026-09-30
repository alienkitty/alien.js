import { RawShaderMaterial, Vector2 } from 'three';

import type { ColorRepresentation, Fog, Texture } from 'three';

export interface ReflectorMaterialOptions {
    color: ColorRepresentation;
    map: Texture | null;
    normalMap: Texture | null;
    normalScale: Vector2;
    reflectivity: number;
    mirror: number;
    mixStrength: number;
    fog: Fog | null;
    dithering: boolean;
}

/**
 * A reflection material.
 */
export class ReflectorMaterial extends RawShaderMaterial {
    constructor(options?: Partial<ReflectorMaterialOptions>);
}
