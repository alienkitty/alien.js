import { RawShaderMaterial } from 'three';

export interface DrawBuffersMaterialOptions {
    cameraNear: number | null;
    cameraFar: number | null;
    instancing: boolean;
}

/**
 * A draw buffers pass material with instancing support.
 */
export class DrawBuffersMaterial extends RawShaderMaterial {
    constructor(options?: Partial<DrawBuffersMaterialOptions>);
}
