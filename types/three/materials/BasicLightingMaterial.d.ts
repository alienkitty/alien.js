import { RawShaderMaterial, Vector3 } from 'three';

import type { Texture } from 'three';

export interface BasicLightingMaterialOptions {
    map: Texture | null;
    lightPosition: Vector3;
    lightIntensity: number;
    instancing: boolean;
}

/**
 * A basic texture map material with position-based lighting,
 * intensity and alpha parameters plus instancing support.
 */
export class BasicLightingMaterial extends RawShaderMaterial {
    constructor(options?: Partial<BasicLightingMaterialOptions>);
}
