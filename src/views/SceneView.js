import { BoxGeometry, Group, Mesh, MeshStandardMaterial } from 'three';

// import { InputManager } from '../controllers/world/InputManager.js';
// import { Stage } from '../utils/Stage.js';

export class SceneView extends Group {
    constructor() {
        super();

        this.visible = false;
        this.position.z = -4;

        this.initMesh();
        this.initViews();
    }

    initMesh() {
        this.geometry = new BoxGeometry(1, 1, 1);

        this.material = new MeshStandardMaterial({
            name: 'Hello World',
            roughness: 0.3,
            metalness: 0.9,
            flatShading: true
        });

        this.mesh = new Mesh(this.geometry, this.material);
        this.add(this.mesh);
    }

    initViews() {
    }

    addListeners() {
        // InputManager.add(this.mesh);
    }

    removeListeners() {
        // InputManager.remove(this.mesh);
    }

    /**
     * Event handlers
     */

    /* onHover = ({ type }) => {
        console.log('onHover', type);
        // if (type === 'over') {
        // } else {
        // }
    };

    onClick = () => {
        console.log('onClick');
        // open('https://alien.js.org/');
        // Stage.setPath('/');
    }; */

    /**
     * Public methods
     */

    update = () => {
        this.mesh.rotation.x -= 0.01;
        this.mesh.rotation.y -= 0.005;
    };

    animateIn = () => {
        this.addListeners();
    };

    ready = () => Promise.all([
    ]);
}
