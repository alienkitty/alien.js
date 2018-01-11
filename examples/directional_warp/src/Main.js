/**
 * Alien.js Example Project.
 *
 * @author Patrick Schroen / https://github.com/pschroen
 */

/* global THREE */

import { Events, Stage, Interface, Component, Canvas, CanvasFont, Device, Mouse, Interaction, Assets, AssetLoader, FontLoader, TweenManager, Shader } from '../alien.js/src/Alien';

import vertRipple from './shaders/ripple.vert';
import fragRipple from './shaders/ripple.frag';
import vertDirectionalWarp from './shaders/directional_warp.vert';
import fragDirectionalWarp from './shaders/directional_warp.frag';

Config.UI_COLOR = 'white';

Config.ASSETS = [
    'assets/js/lib/three.min.js',
    'assets/images/NGC_1672_1920px.jpg',
    'assets/images/Orion_Nebula_1920px.jpg'
];

Assets.CORS = 'Anonymous';


class TitleTexture extends Component {

    constructor() {
        super();
        const self = this;
        let canvas, texture, text;

        initCanvas();

        function initCanvas() {
            canvas = self.initClass(Canvas, Stage.width, Stage.height, true, true);
            self.canvas = canvas;
            texture = new THREE.Texture(canvas.element);
            texture.minFilter = THREE.LinearFilter;
            self.texture = texture;
        }

        this.update = () => {
            canvas.size(Stage.width, Stage.height, true);
            if (text) {
                canvas.remove(text);
                text = text.destroy();
            }
            text = CanvasFont.createText(canvas, Stage.width, Stage.height, 'Directional Warp'.toUpperCase(), '200 66px Oswald', Config.UI_COLOR, {
                lineHeight: 80,
                letterSpacing: 0,
                textAlign: 'center'
            });
            const baseline = (Stage.height - text.totalHeight + 124) / 2;
            text.y = baseline;
            canvas.add(text);
            canvas.render();
            texture.needsUpdate = true;
        };
    }
}

class Title extends Component {

    constructor() {
        super();
        const self = this;
        this.object3D = new THREE.Object3D();
        let title, shader, mesh;

        World.scene.add(this.object3D);

        initCanvasTexture();
        initMesh();

        function initCanvasTexture() {
            title = self.initClass(TitleTexture);
        }

        function initMesh() {
            shader = self.initClass(Shader, vertRipple, fragRipple, {
                time: World.time,
                resolution: World.resolution,
                texture: { value: title.texture },
                opacity: { value: 0 },
                progress: { value: 0 },
                direction: { value: new THREE.Vector2(1.0, -1.0) },
                transparent: true,
                depthWrite: false,
                depthTest: false
            });
            mesh = new THREE.Mesh(new THREE.PlaneBufferGeometry(1, 1), shader.material);
            self.object3D.add(mesh);
        }

        this.update = () => {
            title.update();
            mesh.scale.set(Stage.width, Stage.height, 1);
        };

        this.animateIn = () => {
            shader.uniforms.opacity.value = 0;
            shader.uniforms.progress.value = 0;
            shader.uniforms.direction.value = this.direction < 0 ? new THREE.Vector2(-1.0, 1.0) : new THREE.Vector2(1.0, -1.0);
            TweenManager.tween(shader.uniforms.opacity, { value: 1 }, 250, 'linear');
            TweenManager.tween(shader.uniforms.progress, { value: 1 }, 1600, 'easeOutCubic');
        };
    }
}

class Space extends Component {

    constructor() {
        super();
        const self = this;
        this.object3D = new THREE.Object3D();
        const ratio = 1920 / 1080;
        let texture1, texture2, texture1img, texture2img, shader, mesh, title,
            progress = 0;

        World.scene.add(this.object3D);

        initTextures();
        initMesh();
        initTitle();

        function initTextures() {
            texture1img = Assets.createImage('assets/images/NGC_1672_1920px.jpg');
            texture2img = Assets.createImage('assets/images/Orion_Nebula_1920px.jpg');
            texture1 = new THREE.Texture(null, null, THREE.ClampToEdgeWrapping, THREE.ClampToEdgeWrapping, THREE.LinearFilter, THREE.LinearFilter);
            texture2 = new THREE.Texture(null, null, THREE.ClampToEdgeWrapping, THREE.ClampToEdgeWrapping, THREE.LinearFilter, THREE.LinearFilter);
            Promise.all([Assets.loadImage(texture1img), Assets.loadImage(texture2img)]).then(finishSetup);
        }

        function finishSetup() {
            texture1.image = texture1img;
            texture1.needsUpdate = true;
            texture2.image = texture2img;
            texture2.needsUpdate = true;
            addListeners();
            self.startRender(loop);
            self.object3D.visible = true;
            shader.uniforms.opacity.value = 0;
            shader.uniforms.progress.value = 0;
            TweenManager.tween(shader.uniforms.opacity, { value: 1 }, 1000, 'easeOutCubic');
            TweenManager.tween(shader.uniforms.progress, { value: 1 }, 7000, 'easeOutSine');
            title.animateIn();
        }

        function initMesh() {
            self.object3D.visible = false;
            shader = self.initClass(Shader, vertDirectionalWarp, fragDirectionalWarp, {
                time: World.time,
                resolution: World.resolution,
                texture1: { value: texture1 },
                texture2: { value: texture2 },
                opacity: { value: 0 },
                progress: { value: progress },
                direction: { value: new THREE.Vector2(-1.0, 1.0) },
                depthWrite: false,
                depthTest: false
            });
            mesh = new THREE.Mesh(new THREE.PlaneBufferGeometry(1, 1), shader.material);
            self.object3D.add(mesh);
        }

        function initTitle() {
            title = self.initClass(Title);
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
            title.update();
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

class Progress extends Interface {

    constructor() {
        super('Progress');
        const self = this;
        const size = 90;
        let canvas, context;

        initHTML();
        initCanvas();
        this.startRender(loop);

        function initHTML() {
            self.size(size, size).center();
            self.progress = 0;
        }

        function initCanvas() {
            canvas = self.initClass(Canvas, size, size, true);
            context = canvas.context;
            context.lineWidth = 5;
        }

        function loop() {
            if (self.progress >= 1 && !self.complete) complete();
            context.clearRect(0, 0, size, size);
            const progress = self.progress || 0,
                x = size / 2,
                y = size / 2,
                radius = size * 0.4,
                startAngle = Math.radians(-90),
                endAngle = Math.radians(-90) + Math.radians(progress * 360);
            context.beginPath();
            context.arc(x, y, radius, startAngle, endAngle, false);
            context.strokeStyle = Config.UI_COLOR;
            context.stroke();
        }

        function complete() {
            self.complete = true;
            self.events.fire(Events.COMPLETE);
            self.stopRender(loop);
        }

        this.update = e => {
            if (this.complete) return;
            TweenManager.tween(this, { progress: e.percent }, 500, 'easeOutCubic');
        };

        this.animateOut = callback => {
            this.tween({ scale: 0.9, opacity: 0 }, 400, 'easeInCubic', callback);
        };
    }
}

class Loader extends Interface {

    constructor() {
        super('Loader');
        const self = this;
        let loader, progress;

        initHTML();
        initLoader();
        initProgress();

        function initHTML() {
            self.size('100%');
        }

        function initLoader() {
            loader = self.initClass(AssetLoader, Config.ASSETS);
            loader.events.add(Events.PROGRESS, loadUpdate);
        }

        function initProgress() {
            progress = self.initClass(Progress);
            progress.events.add(Events.COMPLETE, loadComplete);
        }

        function loadUpdate(e) {
            progress.update(e);
        }

        function loadComplete() {
            self.events.fire(Events.COMPLETE);
        }

        this.animateOut = callback => {
            progress.animateOut(callback);
        };
    }
}

class Main {

    constructor() {
        let loader;

        initStage();
        initLoader();
        addListeners();

        function initStage() {
            Stage.size('100%');

            Mouse.init();
        }

        function initLoader() {
            FontLoader.loadFonts(['Oswald', 'Karla']).then(() => {
                loader = Stage.initClass(Loader);
                loader.events.add(Events.COMPLETE, loadComplete);
            });
        }

        function loadComplete() {
            loader.animateOut(() => {
                loader = loader.destroy();
                Stage.events.fire(Events.COMPLETE);
            });
        }

        function addListeners() {
            Stage.events.add(Events.COMPLETE, complete);
        }

        function complete() {
            World.instance();

            Stage.initClass(Space);
        }
    }
}

new Main();
