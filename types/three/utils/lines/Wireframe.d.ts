import { Mesh } from 'three';

import type { BufferGeometry, ColorRepresentation, Material } from 'three';

export interface WireframeOptions {
    geometry: BufferGeometry;
    material: Material;
    color: ColorRepresentation;
    lineWidth: number;
}

/**
 * An instanced polyline wireframe mesh.
 *
 * @see {@link https://threejs.org/examples/#webgl_lines_fat_wireframe | three.js - Fat Lines Wireframe Example}
 * @see {@link https://github.com/mrdoob/three.js/blob/dev/src/geometries/WireframeGeometry.js | three.js - WireframeGeometry Source}
 * @see {@link https://github.com/mrdoob/three.js/blob/dev/examples/jsm/lines/WireframeGeometry2.js | three.js - WireframeGeometry2 Source}
 * @see {@link https://github.com/mrdoob/three.js/blob/dev/examples/jsm/lines/Wireframe.js | three.js - Wireframe Source}
 * @see {@link https://github.com/alienkitty/alien.js/blob/main/src/three/utils/lines/Wireframe.js | Source}
 */
export class Wireframe extends Mesh {
    constructor(options?: Partial<WireframeOptions>);
}
