import { BoxBufferGeometry, Group, Mesh } from 'three';

import { NormalMaterial } from '../materials/NormalMaterial.js';

export class SceneView extends Group {
    constructor() {
        super();

        this.initMesh();
    }

    initMesh() {
        this.mesh = new Mesh(new BoxBufferGeometry(1, 1, 1), new NormalMaterial());
        this.mesh.position.z = -4;

        this.add(this.mesh);
    }

    /**
     * Public methods
     */

    update = () => {
        this.mesh.rotation.x += 0.01;
        this.mesh.rotation.y += 0.02;
    };
}
