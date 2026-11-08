import { RawShaderMaterial } from 'three';

import type { ColorRepresentation } from 'three';

export interface PolylineMaterialOptions {
    color: ColorRepresentation;
    lineWidth: number;
}

/**
 * An instanced polyline material with alpha channel.
 */
export class PolylineMaterial extends RawShaderMaterial {
    constructor(options?: Partial<PolylineMaterialOptions>);
}
