/**
 * Alien.js Example Project.
 *
 * @author Patrick Schroen / https://github.com/pschroen
 */

/* global THREE */

import { Events, Stage, Interface, Component, Canvas, CanvasFont, Device, Mouse, Interaction,
    Assets, AssetLoader, FontLoader, TweenManager, Shader, Effects } from '../alien.js/src/Alien';

import vertBasicShader from './shaders/basic_shader.vert';
import fragBasicShader from './shaders/basic_shader.frag';
import vertBasicPass from './shaders/basic_pass.vert';
//import fragBasicPass from './shaders/basic_pass.frag';
import fragChromaticAberration from './shaders/chromatic_aberration.frag';

Config.UI_COLOR = 'white';

Config.ASSETS = [
    'assets/js/lib/three.min.js',
    'assets/images/NGC_1672_1920px.jpg'
];

Assets.CORS = 'Anonymous';


class TitleTexture extends Component {

    constructor() {
        super();
        const self = this;
        let canvas, texture, text;

        initCanvas();

        function initCanvas() {
            canvas = self.initClass(Canvas, Stage.width, Stage.height, true, '#FFFFFF');
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
            text = CanvasFont.createText(canvas, Stage.width, Stage.height, 'Chromatic Aberration 2'.toUpperCase(), '200 66px Oswald', '#FFFFFF', {
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
            shader = self.initClass(Shader, vertBasicShader, fragBasicShader, {
                time: World.time,
                resolution: World.resolution,
                texture: { value: title.texture },
                opacity: { value: 0 },
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
            TweenManager.tween(shader.uniforms.opacity, { value: 1 }, 250, 'linear');
        };
    }
}

class Space extends Component {

    constructor() {
        super();
        const self = this;
        this.object3D = new THREE.Object3D();
        const ratio = 1920 / 1080;
        let texture, textureimg, shader, mesh, title;

        World.scene.add(this.object3D);

        function initTextures() {
            textureimg = Assets.createImage('assets/images/NGC_1672_1920px.jpg');
            texture = new THREE.Texture(null, null, THREE.ClampToEdgeWrapping, THREE.ClampToEdgeWrapping, THREE.LinearFilter, THREE.LinearFilter);
            return Promise.all([Assets.loadImage(textureimg)]).then(finishSetup);
        }

        function finishSetup() {
            texture.image = textureimg;
            texture.needsUpdate = true;
            initMesh();
            initTitle();
        }

        function initMesh() {
            self.object3D.visible = false;
            shader = self.initClass(Shader, vertBasicShader, fragBasicShader, {
                time: World.time,
                resolution: World.resolution,
                texture: { value: texture },
                opacity: { value: 0 },
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
            resize();
        }

        function resize() {
            if (Stage.width / Stage.height > ratio) mesh.scale.set(Stage.width, Stage.width / ratio, 1);
            else mesh.scale.set(Stage.height * ratio, Stage.height, 1);
            title.update();
        }

        this.animateIn = () => {
            addListeners();
            self.object3D.visible = true;
            shader.uniforms.opacity.value = 0;
            TweenManager.tween(shader.uniforms.opacity, { value: 1 }, 1000, 'easeOutCubic');
            title.animateIn();
        };

        this.ready = initTextures;
    }
}

class World extends Component {

    static instance() {
        if (!this.singleton) this.singleton = new World();
        return this.singleton;
    }

    constructor() {
        super();
        const self = this;
        let renderer, scene, camera, shader, effects,
            distortion = 0;

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
            shader = self.initClass(Shader, vertBasicPass, fragChromaticAberration, {
                texture: { type: 't', value: null },
                distortion: { value: distortion },
                depthWrite: false,
                depthTest: false
            });
            effects = self.initClass(Effects, Stage, {
                renderer,
                scene,
                camera,
                shader,
                dpr: World.dpr
            });
            World.scene = scene;
            World.renderer = renderer;
            World.element = renderer.domElement;
            World.camera = camera;
            World.shader = shader;
            World.effects = effects;
            World.time = { value: 0 };
            World.resolution = { value: new THREE.Vector2(Stage.width * World.dpr, Stage.height * World.dpr) };
        }

        function addListeners() {
            Stage.events.add(Events.RESIZE, resize);
            Mouse.input.events.add(Interaction.START, down);
            Mouse.input.events.add(Interaction.END, up);
            up();
            resize();
        }

        function down() {
            distortion = 0;
        }

        function up() {
            distortion = 100;
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
            effects.render();
            shader.uniforms.distortion.value += (distortion - shader.uniforms.distortion.value) * 0.3;
        }

        this.initEffects = () => {
            shader.uniforms.distortion.value = 0;
            TweenManager.tween(shader.uniforms.distortion, { value: 100 }, 7000, 'easeOutSine');
        };
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
        let loader, space;

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

            space = Stage.initClass(Space);
            space.ready().then(() => {
                space.animateIn();

                World.instance().initEffects();
            });
        }
    }
}

new Main();
