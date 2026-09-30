import { Mesh } from 'three';

import type { ColorRepresentation, InstancedBufferGeometry, Material } from 'three';

export interface PolylineOptions {
    geometry: InstancedBufferGeometry;
    material: Material;
    positions: number[];
    color: ColorRepresentation;
    lineWidth: number;
}

/**
 * An instanced polyline mesh.
 *
 * @see {@link https://threejs.org/examples/#webgl_lines_fat | three.js - Fat Lines Example}
 * @see {@link https://github.com/mrdoob/three.js/blob/dev/examples/jsm/lines/LineGeometry.js | three.js - LineGeometry Source}
 * @see {@link https://github.com/mrdoob/three.js/blob/dev/examples/jsm/lines/LineSegments2.js | three.js - LineSegments2 Source}
 * @see {@link https://github.com/mrdoob/three.js/blob/dev/examples/jsm/lines/Line2.js | three.js - Line2 Source}
 * @see {@link https://github.com/alienkitty/alien.js/blob/main/src/three/utils/lines/Polyline.js | Source}
 */
export class Polyline extends Mesh {
    constructor(options?: Partial<PolylineOptions>);

    setPositions(array: number[]): this;
}
