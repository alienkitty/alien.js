/**
 * Alien.js Example Project.
 *
 * @author Patrick Schroen / https://github.com/pschroen
 */

/* global THREE */

import { Events, Stage, Component, Device, Mouse, Interaction, AssetLoader, TweenManager, Shader } from '../alien.js/src/Alien';

import vertColourBeam from './shaders/ColourBeam.vs';
import fragColourBeam from './shaders/ColourBeam.fs';

Config.ASSETS = [
    'assets/js/lib/three.min.js'
];

class ColourBeamScene extends Component {

    constructor() {
        super();
        const self = this;
        this.object3D = new THREE.Object3D();
        let shader, mesh,
            beamWidth = 40;

        World.scene.add(this.object3D);

        initMesh();
        addListeners();
        this.startRender(loop);

        function initMesh() {
            self.object3D.visible = false;
            shader = self.initClass(Shader, vertColourBeam, fragColourBeam, {
                iGlobalTime: World.time,
                iResolution: World.resolution,
                iMouse: { type: 'v2', value: Mouse.inverseNormal },
                iRadius: { type: 'f', value: 0 },
                iBeam: { type: 'f', value: 0 },
                iBeamWidth: { type: 'f', value: beamWidth }
            });
            mesh = new THREE.Mesh(new THREE.PlaneBufferGeometry(1, 1), shader.material);
            mesh.scale.set(Stage.width, Stage.height, 1);
            self.object3D.add(mesh);
        }

        function addListeners() {
            Stage.events.add(Events.RESIZE, resize);
            Mouse.input.events.add(Interaction.START, down);
            Mouse.input.events.add(Interaction.END, up);
            up();
        }

        function down() {
            beamWidth = 1.2;
        }

        function up() {
            beamWidth = 40;
        }

        function resize() {
            mesh.scale.set(Stage.width, Stage.height, 1);
        }

        function loop() {
            if (!self.object3D.visible) return;
            shader.uniforms.iBeamWidth.value += (beamWidth - shader.uniforms.iBeamWidth.value) * 0.3;
        }

        this.animateIn = () => {
            this.object3D.visible = true;
            shader.uniforms.iBeam.value = 0;
            TweenManager.tween(shader.uniforms.iBeam, { value: 1 }, 1000, 'easeOutSine');
        };
    }
}

class World extends Component {

    static instance() {
        if (!this.singleton) this.singleton = new World();
        return this.singleton;
    }

    constructor() {
        super();
        let renderer, scene, camera;

        World.dpr = Math.max(1, Math.min(1.5, Device.pixelRatio));

        initWorld();
        addListeners();
        this.startRender(loop);
        Stage.add(World.element);

        function initWorld() {
            renderer = new THREE.WebGLRenderer({ powerPreference: 'high-performance' });
            renderer.setPixelRatio(World.dpr);
            renderer.setSize(Stage.width, Stage.height);
            renderer.setClearColor('#000000');
            scene = new THREE.Scene();
            camera = new THREE.PerspectiveCamera(45, Stage.width / Stage.height, 0.01, 200);
            camera.position.set(0, 0, 6);
            camera.target = new THREE.Vector3(0, 0, 0);
            camera.lookAt(camera.target);
            scene.add(camera);

            World.scene = scene;
            World.renderer = renderer;
            World.element = renderer.domElement;
            World.camera = camera;
            World.time = { type: 'f', value: 0 };
            World.resolution = { type: 'v2', value: new THREE.Vector2(Stage.width * World.dpr, Stage.height * World.dpr) };
        }

        function addListeners() {
            Stage.events.add(Events.RESIZE, resize);
            resize();
        }

        function resize() {
            renderer.setSize(Stage.width, Stage.height);
            camera.aspect = Stage.width / Stage.height;
            camera.updateProjectionMatrix();
            World.resolution.value.set(Stage.width * World.dpr, Stage.height * World.dpr);
        }

        function loop(t, delta) {
            World.time.value += delta * 0.001;
            renderer.render(scene, camera);
        }
    }
}

class Main {

    constructor() {
        let scene;

        initStage();

        function initStage() {
            Stage.size('100%');

            Mouse.init();

            AssetLoader.loadAssets(Config.ASSETS).then(initWorld);
        }

        function initWorld() {
            World.instance();

            scene = Stage.initClass(ColourBeamScene);
            scene.animateIn();
        }
    }
}

new Main();
