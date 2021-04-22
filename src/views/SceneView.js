import { BoxGeometry, Group, Mesh, MeshStandardMaterial } from 'three';

export class SceneView extends Group {
    constructor() {
        super();

        this.visible = false;
        this.position.z = -4;

        this.initMesh();
    }

    initMesh() {
        this.geometry = new BoxGeometry(1, 1, 1);

        this.material = new MeshStandardMaterial({
            roughness: 0.3,
            metalness: 0.9,
            flatShading: true
        });

        this.mesh = new Mesh(this.geometry, this.material);
        this.add(this.mesh);
    }

    /**
     * Public methods
     */

    update = () => {
        this.mesh.rotation.x -= 0.01;
        this.mesh.rotation.y -= 0.005;
    };

    animateIn = () => {
        this.visible = true;
    };

    ready = () => {
    };
}
