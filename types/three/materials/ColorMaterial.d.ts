import { Color, RawShaderMaterial } from 'three';

export interface ColorMaterialOptions {
    color: Color;
    instancing: boolean;
}

/**
 * A basic color material with alpha parameter and instancing support.
 */
export class ColorMaterial extends RawShaderMaterial {
    constructor(options?: Partial<ColorMaterialOptions>);
}
