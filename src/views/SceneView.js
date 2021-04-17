import { BoxGeometry, Group, Mesh } from 'three';

import { NormalMaterial } from '../materials/NormalMaterial.js';

export class SceneView extends Group {
    constructor() {
        super();

        this.visible = false;
        this.position.z = -4;

        this.initMesh();
    }

    initMesh() {
        this.mesh = new Mesh(new BoxGeometry(1, 1, 1), new NormalMaterial());
        this.add(this.mesh);
    }

    /**
     * Public methods
     */

    update = () => {
        this.mesh.rotation.x += 0.01;
        this.mesh.rotation.y += 0.02;
    };

    animateIn = () => {
        this.visible = true;
    };

    ready = () => {
    };
}
