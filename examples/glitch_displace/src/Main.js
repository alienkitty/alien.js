/**
 * Alien.js Example Project.
 *
 * @author Patrick Schroen / https://github.com/pschroen
 */

/* global THREE */

import { Events, Stage, Component, Canvas, CanvasGraphics, Device, Mouse, Interaction, Utils, Assets, AssetLoader, TweenManager, Shader } from '../alien.js/src/Alien';

import vertAlienKitty from './shaders/alienkitty.vert';
import fragAlienKitty from './shaders/alienkitty.frag';
import vertGlitchDisplace from './shaders/glitch_displace.vert';
import fragGlitchDisplace from './shaders/glitch_displace.frag';

Config.ASSETS = [
    'assets/js/lib/three.min.js',
    'assets/images/NGC_1672_1920px.jpg',
    'assets/images/Orion_Nebula_1920px.jpg',
    'assets/images/alienkitty.svg',
    'assets/images/alienkitty_eyelid.svg'
];

Assets.CORS = 'Anonymous';

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
            self.loaded = true;
            alienkitty = new CanvasGraphics(90, 86);
            alienkitty.drawImage(alienkittyimg);
            eyelid1 = new CanvasGraphics(24, 14);
            eyelid1.transformPoint('50%', 0).transform({ x: 35, y: 25, scaleX: 1.5, scaleY: 0.01 });
            eyelid1.drawImage(eyelidimg);
            eyelid2 = new CanvasGraphics(24, 14);
            eyelid2.transformPoint(0, 0).transform({ x: 53, y: 26, scaleX: 1, scaleY: 0.01 });
            eyelid2.drawImage(eyelidimg);
            canvas.add(alienkitty);
            canvas.add(eyelid1);
            canvas.add(eyelid2);
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

class AlienKittyScene extends Component {

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
            shader.uniforms.opacity.value = 0;
            TweenManager.tween(shader.uniforms.opacity, { value: 1 }, 1000, 'easeOutSine');
        }

        function initMesh() {
            self.object3D.visible = false;
            shader = self.initClass(Shader, vertAlienKitty, fragAlienKitty, {
                time: World.time,
                resolution: World.resolution,
                texture: { value: alienkitty.texture },
                opacity: { value: 0 },
                transparent: true,
                depthWrite: false,
                depthTest: false
            });
            mesh = new THREE.Mesh(new THREE.PlaneBufferGeometry(1, 1), shader.material);
            mesh.scale.set(90, 86, 1);
            if (World.dpr === 1) mesh.scale.set(90.5, 86.5, 1);
            self.object3D.add(mesh);
        }

        function loop() {
            if (!self.object3D.visible) return;
            alienkitty.canvas.render();
            alienkitty.texture.needsUpdate = true;
        }
    }
}

class SpaceScene extends Component {

    constructor() {
        super();
        const self = this;
        this.object3D = new THREE.Object3D();
        const ratio = 1920 / 1080;
        let texture1, texture2, texture1img, texture2img, shader, mesh,
            progress = 0;

        World.scene.add(this.object3D);

        initTextures();
        initMesh();
        addListeners();

        function initTextures() {
            texture1img = Assets.createImage('assets/images/NGC_1672_1920px.jpg');
            texture2img = Assets.createImage('assets/images/Orion_Nebula_1920px.jpg');
            texture1 = new THREE.Texture(null, null, THREE.ClampToEdgeWrapping, THREE.ClampToEdgeWrapping, THREE.LinearFilter, THREE.LinearFilter);
            texture2 = new THREE.Texture(null, null, THREE.ClampToEdgeWrapping, THREE.ClampToEdgeWrapping, THREE.LinearFilter, THREE.LinearFilter);
            Promise.all([Assets.loadImage(texture1img), Assets.loadImage(texture2img)]).then(finishSetup);
        }

        function finishSetup() {
            self.startRender(loop);
            texture1.image = texture1img;
            texture1.needsUpdate = true;
            texture2.image = texture2img;
            texture2.needsUpdate = true;
            self.object3D.visible = true;
            shader.uniforms.progress.value = 0;
            TweenManager.tween(shader.uniforms.progress, { value: 1 }, 7000, 'easeOutSine');
        }

        function initMesh() {
            self.object3D.visible = false;
            shader = self.initClass(Shader, vertGlitchDisplace, fragGlitchDisplace, {
                time: World.time,
                resolution: World.resolution,
                texture1: { value: texture1 },
                texture2: { value: texture2 },
                progress: { value: progress },
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
            progress = 0;
        }

        function up() {
            progress = 1;
        }

        function resize() {
            if (Stage.width / Stage.height > ratio) mesh.scale.set(Stage.width, Stage.width / ratio, 1);
            else mesh.scale.set(Stage.height * ratio, Stage.height, 1);
        }

        function loop() {
            if (!self.object3D.visible) return;
            shader.uniforms.progress.value += (progress - shader.uniforms.progress.value) * 0.03;
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

            Stage.initClass(SpaceScene);
            Stage.initClass(AlienKittyScene);
        }
    }
}

new Main();
