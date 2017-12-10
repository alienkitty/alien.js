/**
 * Alien.js Example Project.
 *
 * @author Patrick Schroen / https://github.com/pschroen
 */

/* global THREE */

import { Events, Stage, Component, Device, Mouse, Interaction, AssetLoader, Images, TweenManager, Shader } from '../alien.js/src/Alien';

import vertDissolve from './shaders/Dissolve.vs';
import fragDissolve from './shaders/Dissolve.fs';

Config.ASSETS = [
    'assets/js/lib/three.min.js',
    'assets/images/NGC_1672_1920px.jpg',
    'assets/images/Orion_Nebula_1920px.jpg'
];

class DissolveScene extends Component {

    constructor() {
        super();
        const self = this;
        const ratio = 1920 / 1080;
        this.object3D = new THREE.Object3D();
        let texture1, texture2, texture1img, texture2img, shader, mesh,
            alpha = 0;

        World.scene.add(this.object3D);

        initTextures();
        initMesh();
        addListeners();

        function initTextures() {
            texture1img = Images.createImg('assets/images/NGC_1672_1920px.jpg');
            texture2img = Images.createImg('assets/images/Orion_Nebula_1920px.jpg');
            texture1 = new THREE.Texture(null, null, THREE.ClampToEdgeWrapping, THREE.ClampToEdgeWrapping, THREE.LinearFilter, THREE.LinearFilter);
            texture2 = new THREE.Texture(null, null, THREE.ClampToEdgeWrapping, THREE.ClampToEdgeWrapping, THREE.LinearFilter, THREE.LinearFilter);
            Promise.all([Images.promise(texture1img), Images.promise(texture2img)]).then(finishSetup);
        }

        function finishSetup() {
            texture1.image = texture1img;
            texture1.needsUpdate = true;
            texture2.image = texture2img;
            texture2.needsUpdate = true;
            self.object3D.visible = true;
            shader.uniforms.iAlpha.value = 0;
            TweenManager.tween(shader.uniforms.iAlpha, { value: 1 }, 7000, 'easeOutSine', () => self.startRender(loop));
        }

        function initMesh() {
            self.object3D.visible = false;
            shader = self.initClass(Shader, vertDissolve, fragDissolve, {
                iGlobalTime: World.time,
                iResolution: World.resolution,
                iChannel0: { value: texture1 },
                iChannel1: { value: texture2 },
                iAlpha: { value: alpha },
                depthWrite: false,
                depthTest: false
            });
            mesh = new THREE.Mesh(new THREE.PlaneBufferGeometry(1, 1), shader.material);
            self.object3D.add(mesh);
        }

        function addListeners() {
            Stage.events.add(Events.RESIZE, resize);
            Mouse.input.events.add(Interaction.START, down);
            Mouse.input.events.add(Interaction.END, up);
            up();
            resize();
        }

        function down() {
            alpha = 0;
        }

        function up() {
            alpha = 1;
        }

        function resize() {
            if (Stage.width / Stage.height > ratio) mesh.scale.set(Stage.width, Stage.width / ratio, 1);
            else mesh.scale.set(Stage.height * ratio, Stage.height, 1);
        }

        function loop() {
            if (!self.object3D.visible) return;
            shader.uniforms.iAlpha.value += (alpha - shader.uniforms.iAlpha.value) * 0.3;
        }
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

        World.dpr = Math.min(2, Device.pixelRatio);

        initWorld();
        addListeners();
        this.startRender(loop);
        Stage.add(World.element);

        function initWorld() {
            renderer = new THREE.WebGLRenderer({ powerPreference: 'high-performance' });
            renderer.setPixelRatio(World.dpr);
            scene = new THREE.Scene();
            camera = new THREE.PerspectiveCamera(60, Stage.width / Stage.height, 1, 10000);
            World.scene = scene;
            World.renderer = renderer;
            World.element = renderer.domElement;
            World.camera = camera;
            World.time = { value: 0 };
            World.resolution = { value: new THREE.Vector2(Stage.width * World.dpr, Stage.height * World.dpr) };
        }

        function addListeners() {
            Stage.events.add(Events.RESIZE, resize);
            resize();
        }

        function resize() {
            renderer.setSize(Stage.width, Stage.height);
            camera.aspect = Stage.width / Stage.height;
            camera.position.z = 1 / Math.tan(Math.radians(30)) * 0.5 * Stage.height;
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

        initStage();

        function initStage() {
            Stage.size('100%');

            Mouse.init();

            AssetLoader.loadAssets(Config.ASSETS).then(initWorld);
        }

        function initWorld() {
            World.instance();

            Stage.initClass(DissolveScene);
        }
    }
}

new Main();
