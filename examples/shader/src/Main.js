/**
 * Alien.js Example Project.
 *
 * @author Patrick Schroen / https://github.com/pschroen
 */

/* global THREE */

import { Events, Stage, Component, Canvas, CanvasGraphics, Device, Utils, Assets, AssetLoader, TweenManager, Shader } from '../alien.js/src/Alien';

import vert from './shaders/vert.glsl';
import frag from './shaders/frag.glsl';

Config.ASSETS = [
    'assets/js/lib/three.min.js',
    'assets/images/alienkitty.svg',
    'assets/images/alienkitty_eyelid.svg'
];

class AlienKittyTexture extends Component {

    constructor() {
        super();
        const self = this;
        let canvas, texture, alienkittyimg, eyelidimg, alienkitty, eyelid1, eyelid2;

        initCanvas();

        function initCanvas() {
            canvas = self.initClass(Canvas, 90, 86, true);
            self.canvas = canvas;
            texture = new THREE.Texture(canvas.element);
            texture.minFilter = THREE.LinearFilter;
            self.texture = texture;
        }

        function initImages() {
            alienkittyimg = Assets.createImage('assets/images/alienkitty.svg');
            eyelidimg = Assets.createImage('assets/images/alienkitty_eyelid.svg');
            return Promise.all([Assets.loadImage(alienkittyimg), Assets.loadImage(eyelidimg)]).then(finishSetup);
        }

        function finishSetup() {
            alienkitty = new CanvasGraphics(90, 86);
            alienkitty.drawImage(alienkittyimg);
            eyelid1 = new CanvasGraphics(24, 14);
            eyelid1.transformPoint('50%', 0).transform({ x: 35, y: 25, scaleX: 1.5, scaleY: 0.01 });
            eyelid1.drawImage(eyelidimg);
            eyelid2 = new CanvasGraphics(24, 14);
            eyelid2.transformPoint(0, 0).transform({ x: 53, y: 26, scaleX: 1, scaleY: 0.01 });
            eyelid2.drawImage(eyelidimg);
            alienkitty.add(eyelid1);
            alienkitty.add(eyelid2);
            canvas.add(alienkitty);
            blink();
        }

        function blink() {
            self.delayedCall(Utils.headsTails(blink1, blink2), Utils.random(0, 10000));
        }

        function blink1() {
            TweenManager.tween(eyelid1, { scaleY: 1.5 }, 120, 'easeOutCubic', () => {
                TweenManager.tween(eyelid1, { scaleY: 0.01 }, 180, 'easeOutCubic');
            });
            TweenManager.tween(eyelid2, { scaleX: 1.3, scaleY: 1.3 }, 120, 'easeOutCubic', () => {
                TweenManager.tween(eyelid2, { scaleX: 1, scaleY: 0.01 }, 180, 'easeOutCubic', () => {
                    blink();
                });
            });
        }

        function blink2() {
            TweenManager.tween(eyelid1, { scaleY: 1.5 }, 120, 'easeOutCubic', () => {
                TweenManager.tween(eyelid1, { scaleY: 0.01 }, 180, 'easeOutCubic');
            });
            TweenManager.tween(eyelid2, { scaleX: 1.3, scaleY: 1.3 }, 180, 'easeOutCubic', () => {
                TweenManager.tween(eyelid2, { scaleX: 1, scaleY: 0.01 }, 240, 'easeOutCubic', () => {
                    blink();
                });
            });
        }

        this.ready = initImages;
    }
}

class Scene extends Component {

    constructor() {
        super();
        const self = this;
        this.object3D = new THREE.Object3D();
        let alienkitty, shader, mesh;

        World.scene.add(this.object3D);

        initCanvasTexture();
        initMesh();

        function initCanvasTexture() {
            alienkitty = self.initClass(AlienKittyTexture);
            alienkitty.ready().then(finishSetup);
        }

        function finishSetup() {
            self.startRender(loop);
            self.object3D.visible = true;
        }

        function initMesh() {
            self.object3D.visible = false;
            shader = self.initClass(Shader, vert, frag, {
                time: World.time,
                resolution: World.resolution,
                texture: { value: alienkitty.texture }
            });
            mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), shader.material);
            mesh.rotation.y = -Math.PI;
            self.object3D.add(mesh);
        }

        function loop() {
            if (!self.object3D.visible) return;
            alienkitty.canvas.render();
            alienkitty.texture.needsUpdate = true;
            mesh.rotation.y += 0.01;
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

        World.dpr = Math.min(1.5, Device.pixelRatio);

        initWorld();
        addListeners();
        this.startRender(loop);
        Stage.add(World.element);

        function initWorld() {
            renderer = new THREE.WebGLRenderer({ antialias: true });
            renderer.setPixelRatio(World.dpr);
            scene = new THREE.Scene();
            camera = new THREE.PerspectiveCamera(65, Stage.width / Stage.height, 0.01, 200);
            camera.position.set(0.85, 1, -1.5);
            camera.target = new THREE.Vector3(0, 0, 0);
            camera.lookAt(camera.target);
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

            AssetLoader.loadAssets(Config.ASSETS).then(initWorld);
        }

        function initWorld() {
            World.instance();

            Stage.initClass(Scene);
        }
    }
}

window.onload = () => new Main();
