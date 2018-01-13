/**
 * Alien.js Example Project.
 *
 * @author Patrick Schroen / https://github.com/pschroen
 */

/* global THREE */

import { Events, Stage, Interface, Component, Canvas, CanvasFont, Device, Mouse, Assets, Slide, SlideLoader, SlideVideo,
    MultiLoader, AssetLoader, FontLoader, StateDispatcher, TweenManager, Shader } from '../alien.js/src/Alien';

import vertRipple from './shaders/ripple.vert';
import fragRipple from './shaders/ripple.frag';
import vertDirectionalWarp from './shaders/directional_warp.vert';
import fragDirectionalWarp from './shaders/directional_warp.frag';

Config.UI_COLOR = 'white';

Config.ASSETS = [
    'assets/js/lib/three.min.js'
];

class Work {

    constructor(item) {
        this.slug = item.slug;
        this.path = `work/${this.slug}/`;
        this.title = item.title;
        this.pageTitle = `${this.title} / Alien.js Example Project`;
        this.description = item.description;
        this.src = `assets/video/${this.slug}.mp4`;
        this.img = `assets/images/shot/${this.slug}.jpg`;
    }
}

Config.LIST = [
    new Work({ slug: 'galaxy', title: 'Video 1', description: 'Directional Warp 2' }),
    new Work({ slug: 'particles', title: 'Video 2', description: 'Directional Warp 2' })
];

Global.SLIDE_INDEX = 0;

Events.START = 'start';
Events.SLIDE_CHANGE = 'slide_change';

Assets.CORS = 'Anonymous';


class Data extends StateDispatcher {

    static instance() {
        if (!this.singleton) this.singleton = new Data();
        return this.singleton;
    }

    constructor() {

        // StateDispatcher @param {boolean} [forceHash = undefined] Force hash navigation
        super(true);
        const self = this;

        addListeners();

        function addListeners() {
            self.events.add(Events.UPDATE, stateChange);
        }

        function stateChange(e) {
            if (e.path !== '') self.setSlide(e);
        }

        this.setSlide = e => {
            Stage.events.fire(Events.SLIDE_CHANGE, e.value ? e.value.position : Stage.pathList.indexOf(e.path) || 0);
        };
    }
}

class TitleTexture extends Component {

    constructor() {
        super();
        const self = this;
        let canvas, texture, text, text2;

        initCanvas();

        function initCanvas() {
            canvas = self.initClass(Canvas, Stage.width, Stage.height, true, true);
            self.canvas = canvas;
            texture = new THREE.Texture(canvas.element);
            texture.minFilter = THREE.LinearFilter;
            self.texture = texture;
        }

        this.update = () => {
            const data = Config.LIST[Global.SLIDE_INDEX];
            canvas.size(Stage.width, Stage.height, true);
            if (text) {
                canvas.remove(text);
                text = text2 = text.destroy();
            }
            text = CanvasFont.createText(canvas, Stage.width, Stage.height, data.title.toUpperCase(), '200 66px Oswald', Config.UI_COLOR, {
                lineHeight: 80,
                letterSpacing: 0,
                textAlign: 'center'
            });
            text2 = CanvasFont.createText(canvas, Stage.width, Stage.height, data.description.toUpperCase(), '400 14px Karla', Config.UI_COLOR, {
                lineHeight: 16,
                letterSpacing: 2.4,
                textAlign: 'center'
            });
            text2.y = 18 + text2.totalHeight;
            text.add(text2);
            const baseline = (Stage.height - (text.totalHeight + 18 + text2.totalHeight) + 124) / 2;
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

        this.animateIn = callback => {
            shader.uniforms.opacity.value = 0;
            shader.uniforms.progress.value = 0;
            shader.uniforms.direction.value = this.direction < 0 ? new THREE.Vector2(-1.0, 1.0) : new THREE.Vector2(1.0, -1.0);
            TweenManager.tween(shader.uniforms.opacity, { value: 1 }, 250, 'linear');
            TweenManager.tween(shader.uniforms.progress, { value: 1 }, 1600, 'easeOutCubic', () => {
                this.visible = true;
                if (callback) callback();
            });
        };

        this.animateOut = callback => {
            shader.uniforms.opacity.value = 1;
            shader.uniforms.progress.value = 1;
            shader.uniforms.direction.value = this.direction < 0 ? new THREE.Vector2(-1.0, 1.0) : new THREE.Vector2(1.0, -1.0);
            TweenManager.tween(shader.uniforms.opacity, { value: 0 }, 250, 'linear');
            TweenManager.tween(shader.uniforms.progress, { value: 0 }, 1200, 'easeOutCubic', () => {
                this.visible = false;
                if (callback) callback();
            });
        };
    }
}

class Space extends Component {

    constructor() {
        super();
        const self = this;
        this.object3D = new THREE.Object3D();
        const ratio = 1920 / 1080;
        let texture1, texture2, shader, mesh, slide, slide1, slide2, video1, video2, playing1, playing2, title;

        World.scene.add(this.object3D);

        initTextures();
        initMesh();
        initTitle();
        addListeners();
        this.startRender(loop);

        function initTextures() {
            texture1 = new THREE.Texture(null, null, THREE.ClampToEdgeWrapping, THREE.ClampToEdgeWrapping, THREE.LinearFilter, THREE.LinearFilter);
            texture2 = new THREE.Texture(null, null, THREE.ClampToEdgeWrapping, THREE.ClampToEdgeWrapping, THREE.LinearFilter, THREE.LinearFilter);
        }

        function initMesh() {
            shader = self.initClass(Shader, vertDirectionalWarp, fragDirectionalWarp, {
                time: World.time,
                resolution: World.resolution,
                texture1: { value: texture1 },
                texture2: { value: texture2 },
                opacity: { value: 0 },
                progress: { value: 0 },
                direction: { value: new THREE.Vector2(-1.0, 1.0) },
                transparent: true,
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
            const state = Data.instance().getState(),
                index = Stage.pathList.indexOf(state.path);
            if (~index) Global.SLIDE_INDEX = index;
            slide = self.initClass(Slide, {
                num: Stage.list.length,
                max: {
                    x: 0,
                    y: Stage.height
                },
                index: Global.SLIDE_INDEX,
                axes: ['y']
            });
            slide.events.add(Events.UPDATE, slideUpdate);
            Stage.events.add(Events.SLIDE_CHANGE, slideChange);
            Stage.events.add(Events.RESIZE, resize);
            resize();
        }

        function slideUpdate(e) {
            Global.SLIDE_INDEX = e.index;
            const data = Config.LIST[Global.SLIDE_INDEX];
            if (self.loaded) {
                title.direction = e.direction.y;
                title.update();
                title.animateIn();
                const progress = slide.y / slide.max.y,
                    i = Math.round(progress);
                Data.instance().setState({ position: i }, data.path);
            } else {
                const state = Data.instance().getState(),
                    index = Stage.pathList.indexOf(state.path);
                if (!~index) Data.instance().replaceState(data.path);
            }
            Data.instance().setTitle(data.pageTitle);
        }

        function slideChange(e) {
            slide.goto(e);
        }

        function resize() {
            if (Stage.width / Stage.height > ratio) mesh.scale.set(Stage.width, Stage.width / ratio, 1);
            else mesh.scale.set(Stage.height * ratio, Stage.height, 1);
            slide.max.y = Stage.height;
            title.update();
        }

        function loop() {
            if (slide1 !== slide.floor || slide2 !== slide.ceil) {
                slide1 = slide.floor;
                slide2 = slide.ceil;
                updateTextures();
            }
            if (playing1 && video1.ready()) texture1.needsUpdate = true;
            if (playing2 && video2.ready()) texture2.needsUpdate = true;
            shader.uniforms.progress.value = slide.progress;
        }

        function updateTextures() {
            video1 = Stage.list[slide1];
            video2 = Stage.list[slide2];
            if (SlideVideo.test) {
                unsetTextures(slide1, slide2);
                playing1 = false;
                playing2 = false;
            }
            setTexture1();
            setTexture2();
        }

        function unsetTextures(t1, t2) {
            Stage.list.forEach((video, i) => {
                if (i !== t1 && i !== t2) {
                    video.events.remove(Events.READY, play1);
                    video.events.remove(Events.READY, play2);
                    video.pause();
                }
            });
        }

        function setTexture1() {
            texture1.image = video1.element;
            if (SlideVideo.test) {
                if (video1.playing) {
                    play1();
                } else {
                    video1.events.add(Events.READY, play1);
                    video1.resume();
                }
            } else {
                texture1.needsUpdate = true;
                loaded();
            }
        }

        function setTexture2() {
            texture2.image = video2.element;
            if (SlideVideo.test) {
                if (video2.playing) {
                    play2();
                } else {
                    video2.events.add(Events.READY, play2);
                    video2.resume();
                }
            } else {
                texture2.needsUpdate = true;
            }
        }

        function play1() {
            playing1 = true;
            loaded();
        }

        function play2() {
            playing2 = true;
        }

        function loaded() {
            if (!self.loaded) {
                self.loaded = true;
                Stage.events.fire(Events.START);
            }
        }

        this.animateIn = () => {
            shader.uniforms.opacity.value = 0;
            TweenManager.tween(shader.uniforms.opacity, { value: 1 }, 1000, 'easeOutCubic');
            title.animateIn();
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
        let slide, loader, progress;

        initHTML();
        initLoader();
        initProgress();

        function initHTML() {
            self.size('100%');
        }

        function initLoader() {
            slide = self.initClass(SlideLoader, Config.LIST);
            loader = self.initClass(MultiLoader);
            loader.push(self.initClass(FontLoader, ['Oswald', 'Karla']));
            loader.push(self.initClass(AssetLoader, Config.ASSETS));
            loader.push(slide);
            loader.events.add(Events.PROGRESS, loadUpdate);
            Stage.list = slide.list;
            Stage.pathList = slide.pathList;
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
            loader = Stage.initClass(Loader);
            loader.events.add(Events.COMPLETE, loadComplete);
        }

        function loadComplete() {
            loader.animateOut(() => {
                loader = loader.destroy();
                Stage.events.fire(Events.COMPLETE);
            });
        }

        function addListeners() {
            Stage.events.add(Events.COMPLETE, complete);
            Stage.events.add(Events.START, start);
        }

        function complete() {
            World.instance();

            space = Stage.initClass(Space);
        }

        function start() {
            space.animateIn();
        }
    }
}

new Main();
