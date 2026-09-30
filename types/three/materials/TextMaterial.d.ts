import { RawShaderMaterial } from 'three';

import type { ColorRepresentation, Texture } from 'three';

export interface TextMaterialOptions {
    map: Texture | null;
    color: ColorRepresentation;
}

/**
 * An MSDF (Multichannel Signed Distance Fields) text material,
 * with color and alpha parameters.
 */
export class TextMaterial extends RawShaderMaterial {
    constructor(options?: Partial<TextMaterialOptions>);
}
