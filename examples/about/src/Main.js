/**
 * Alien.js Example Project.
 *
 * @author Patrick Schroen / https://github.com/pschroen
 */

/* global THREE */

import { Events, Stage, Interface, Component, Device, Mouse, Interaction, Accelerometer, Utils,
    Assets, AssetLoader, FontLoader, TweenManager, WebAudio, Shader } from '../alien.js/src/Alien';

import vertColourBeam from './shaders/colour_beam.vert';
import fragColourBeam from './shaders/colour_beam.frag';

Config.UI_COLOR = 'white';
Config.UI_OFFSET = Device.phone ? 20 : 35;
Config.ABOUT_COPY = 'A lightweight web framework for the future.';
Config.ABOUT_HYDRA_URL = 'https://medium.com/@activetheory/mira-exploring-the-potential-of-the-future-web-e1f7f326d58e';
Config.ABOUT_GITHUB_URL = 'https://github.com/pschroen/alien.js';

Config.ASSETS = [
    'assets/js/lib/three.min.js',
    'assets/sounds/BassDrum.mp3',
    'assets/sounds/DeepSpacy.mp3',
    'assets/sounds/MagicGleam.mp3'
];

Events.START = 'start';
Events.OPEN_ABOUT = 'open_about';
Events.CLOSE_ABOUT = 'close_about';


class UIAbout extends Interface {

    constructor() {
        super('UIAbout');
        const self = this;
        const texts = [];
        let wrapper, alienkitty, description;

        initHTML();
        initText();
        addListeners();

        function initHTML() {
            self.size('100%').size(800, 430).center();
            wrapper = self.create('.wrapper');
            wrapper.size(600, 350).enable3D(2000);
            wrapper.rotationY = 0;
            wrapper.rotationX = 0;
            alienkitty = wrapper.initClass(AlienKitty);
            alienkitty.transform({ z: -20 }).css({ marginTop: -88 });
        }

        function initText() {
            description = self.create('.description');
            description.size(260, 50);
            description.fontStyle('Lato', 12, Config.UI_COLOR);
            description.css({
                left: 350,
                top: 200,
                fontWeight: '700',
                lineHeight: 25,
                letterSpacing: 12 * 0.03,
                opacity: 0.75
            });
            description.top = 200;
            description.text(Config.ABOUT_COPY);
            texts.push(description);
            ['Source code', 'Inspiration'].forEach((text, i) => {
                const link = self.create('.link');
                link.size('auto', 20);
                link.fontStyle('Lato', 12, Config.UI_COLOR);
                link.css({
                    left: 350,
                    top: 250 + i * 27,
                    fontWeight: '700',
                    letterSpacing: 12 * 0.03
                });
                link.text(text);
                link.letters = link.split();
                link.interact(hover, click);
                link.hit.mouseEnabled(true);
                link.top = 250 + i * 27;
                link.title = text;
                texts.push(link);
            });
        }

        function addListeners() {
            Stage.events.add(Events.RESIZE, resize);
            resize();
        }

        function resize() {
            if (Stage.width < 800) {
                wrapper.transform({ x: 100 });
                texts.forEach(text => text.css({ left: 270 }));
            } else {
                wrapper.transform({ x: 0 });
                texts.forEach(text => text.css({ left: 350 }));
            }
        }

        function hover(e) {
            if (e.action === 'over') e.object.letters.forEach((letter, i) => letter.tween({ y: -5, opacity: 0 }, 125, 'easeOutCubic', 15 * i, () => letter.transform({ y: 5 }).tween({ y: 0, opacity: 1 }, 300, 'easeOutCubic')));
        }

        function click(e) {
            WebAudio.mute();
            setTimeout(() => {
                const title = e.object.title.toLowerCase();
                getURL(~title.indexOf('source') ? Config.ABOUT_GITHUB_URL : Config.ABOUT_HYDRA_URL);
            }, 300);
        }

        this.update = () => {
            if (Device.mobile) {
                wrapper.rotationY += (Accelerometer.x - wrapper.rotationY) * 0.07;
                wrapper.rotationX += (-Accelerometer.y - wrapper.rotationX) * 0.07;
            } else {
                wrapper.rotationY += (Math.range(Mouse.x, 0, Stage.width, -5, 5) - wrapper.rotationY) * 0.07;
                wrapper.rotationX += (-Math.range(Mouse.y, 0, Stage.height, -10, 10) - wrapper.rotationX) * 0.07;
            }
            wrapper.transform();
        };

        this.animateIn = () => {
            alienkitty.ready().then(alienkitty.animateIn);
            texts.forEach((text, i) => text.transform({ y: 50 }).css({ opacity: 0 }).tween({ y: 0, opacity: text.hit ? 1 : 0.75 }, 1000, 'easeOutCubic', 500 + i * 80));
        };

        this.animateOut = () => {
            alienkitty.animateOut();
            texts.forEach((text, i) => text.tween({ y: 20, opacity: 0 }, 500, 'easeInCubic', 40 + (texts.length - i) * 40));
        };
    }
}

class UIFooterItem extends Interface {

    constructor(copy, width) {
        super('UIFooterItem');
        const self = this;
        let text, letters;

        initHTML();
        initText();
        addListeners();

        function initHTML() {
            self.size(width, 25);
            self.css({
                top: 0,
                right: 0
            });
        }

        function initText() {
            text = self.create('.text');
            text.fontStyle('Lato', 12, Config.UI_COLOR);
            text.css({
                width: '100%',
                fontWeight: '700',
                lineHeight: 25,
                letterSpacing: 12 * 0.03,
                textAlign: 'center',
                whiteSpace: 'nowrap'
            });
            text.text(copy);
            letters = text.split();
        }

        function addListeners() {
            self.interact(hover, click);
            self.hit.mouseEnabled(true);
        }

        function hover(e) {
            if (e.action === 'over') letters.forEach((letter, i) => letter.tween({ y: -5, opacity: 0 }, 125, 'easeOutCubic', 15 * i, () => letter.transform({ y: 5 }).tween({ y: 0, opacity: 1 }, 300, 'easeOutCubic')));
        }

        function click() {
            self.events.fire(Events.CLICK);
        }
    }
}

class UIFooter extends Interface {

    constructor() {
        super('UIFooter');
        const self = this;
        let source, about;

        initHTML();
        initSource();
        initAbout();
        addListeners();

        function initHTML() {
            self.size(240, 30).css({
                bottom: Config.UI_OFFSET,
                right: Config.UI_OFFSET
            });
        }

        function initSource() {
            source = self.initClass(UIFooterItem, 'Source code', 80);
            source.transform({ x: -10 }).css({ opacity: 0 }).tween({ x: 0, opacity: 1 }, 1000, 'easeOutQuart', 2100);
        }

        function initAbout() {
            about = self.initClass(UIFooterItem, 'About', 42);
            about.transform({ x: -10 }).css({ opacity: 0, right: 95 }).tween({ x: 0, opacity: 1 }, 1000, 'easeOutQuart', 2300);
        }

        function addListeners() {
            source.events.add(Events.CLICK, sourceClick);
            about.events.add(Events.CLICK, aboutClick);
        }

        function sourceClick() {
            WebAudio.mute();
            setTimeout(() => getURL(Config.ABOUT_GITHUB_URL), 300);
        }

        function aboutClick() {
            Stage.events.fire(Events.OPEN_ABOUT);
        }
    }
}

class UI extends Interface {

    static instance() {
        if (!this.singleton) this.singleton = new UI();
        return this.singleton;
    }

    constructor() {
        super('UI');
        const self = this;
        let bg, about;

        initHTML();
        initViews();
        addListeners();
        Stage.add(this);

        function initHTML() {
            self.hide();
            self.size('100%').css({ left: 0, top: 0 }).mouseEnabled(false);
            bg = self.create('.bg');
            bg.size('100%').bg('#000').css({ opacity: 0 });
            bg.interact(null, closeAbout);
            bg.hit.css({ cursor: 'auto' });
            bg.hit.mouseEnabled(true);
        }

        function initViews() {
            about = self.initClass(UIAbout);
            Stage.initClass(UIFooter);
        }

        function addListeners() {
            Stage.events.add(Events.OPEN_ABOUT, openAbout);
            Stage.events.add(Events.CLOSE_ABOUT, closeAbout);
        }

        function openAbout() {
            self.startRender(loop);
            self.show();
            bg.tween({ opacity: 0.85 }, 2000, 'easeOutSine');
            about.animateIn();
            bg.hit.show();
        }

        function closeAbout() {
            bg.hit.hide();
            about.animateOut();
            bg.tween({ opacity: 0 }, 1000, 'easeOutSine', () => {
                self.hide();
                self.stopRender(loop);
            });
        }

        function loop() {
            about.update();
        }
    }
}

class ColourBeam extends Component {

    constructor() {
        super();
        const self = this;
        this.object3D = new THREE.Object3D();
        let shader, mesh, gleam,
            beamWidth = 40,
            audioMoveVolume = 0;

        World.scene.add(this.object3D);

        initMesh();

        function initMesh() {
            self.object3D.visible = false;
            shader = self.initClass(Shader, vertColourBeam, fragColourBeam, {
                time: World.time,
                resolution: World.resolution,
                mouse: { value: Mouse.inverseNormal },
                radius: { value: 0 },
                beam: { value: 0 },
                beamWidth: { value: beamWidth },
                depthWrite: false,
                depthTest: false
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
            resize();
        }

        function down() {
            beamWidth = 1.2;
            audioMoveVolume = 1;
        }

        function up() {
            beamWidth = 40;
            audioMoveVolume = 0;
        }

        function resize() {
            mesh.scale.set(Stage.width, Stage.height, 1);
        }

        function loop() {
            if (!self.object3D.visible) return;
            shader.uniforms.beamWidth.value += (beamWidth - shader.uniforms.beamWidth.value) * 0.3;
            if (gleam) gleam.gain.value += (audioMoveVolume - gleam.gain.value) * 0.3;
        }

        this.animateIn = () => {
            addListeners();
            this.startRender(loop);
            this.object3D.visible = true;
            shader.uniforms.beam.value = 0;
            TweenManager.tween(shader.uniforms.beam, { value: 1 }, 1000, 'easeOutSine');
        };

        this.initAudio = () => {
            gleam = WebAudio.getSound('MagicGleam');
            if (gleam) {
                gleam.gain.value = 0;
                gleam.loop = true;
                WebAudio.trigger('MagicGleam');
                //TweenManager.tween(gleam.gain, { value: 1 }, 500, 'easeOutCubic');
            }
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
        const audioMinVolume = 0.5,
            audioMoveDecay = 0.95;
        let renderer, scene, camera, spacy,
            audioMoveVolume = audioMinVolume;

        World.dpr = Math.min(1.5, Device.pixelRatio);

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
            Mouse.input.events.add(Interaction.MOVE, move);
            Stage.events.add(Events.RESIZE, resize);
            resize();
        }

        function move() {
            audioMoveVolume = Math.range(Mouse.input.velocity.length(), 0, 8, 0.5, 1, true);
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
            if (spacy) {
                audioMoveVolume *= audioMoveDecay;
                if (audioMoveVolume < audioMinVolume) audioMoveVolume = audioMinVolume;
                spacy.gain.value += (audioMoveVolume - spacy.gain.value) * 0.3;
            }
        }

        this.initAudio = () => {
            spacy = WebAudio.getSound('DeepSpacy');
            if (spacy) {
                spacy.gain.value = audioMinVolume;
                spacy.loop = true;
                WebAudio.trigger('DeepSpacy');
            }
        };
    }
}

class AlienKitty extends Interface {

    constructor() {
        super('AlienKitty');
        const self = this;
        let alienkitty, eyelid1, eyelid2;

        initHTML();

        function initHTML() {
            self.size(90, 86).center().css({ opacity: 0 });
            alienkitty = self.create('.alienkitty').size(90, 86);
            eyelid1 = alienkitty.create('.eyelid1').size(24, 14).css({ left: 35, top: 25 }).transformPoint('50%', 0).transform({ scaleX: 1.5, scaleY: 0.01 });
            eyelid2 = alienkitty.create('.eyelid2').size(24, 14).css({ left: 53, top: 26 }).transformPoint(0, 0).transform({ scaleX: 1, scaleY: 0.01 });
        }

        function initImages() {
            return Promise.all([
                Assets.loadImage('assets/images/alienkitty.svg'),
                Assets.loadImage('assets/images/alienkitty_eyelid.svg')]
            ).then(finishSetup);
        }

        function finishSetup() {
            alienkitty.bg('assets/images/alienkitty.svg');
            eyelid1.bg('assets/images/alienkitty_eyelid.svg');
            eyelid2.bg('assets/images/alienkitty_eyelid.svg');
        }

        function blink() {
            self.delayedCall(Utils.headsTails(blink1, blink2), Utils.random(0, 10000));
        }

        function blink1() {
            eyelid1.tween({ scaleY: 1.5 }, 120, 'easeOutCubic', () => {
                eyelid1.tween({ scaleY: 0.01 }, 180, 'easeOutCubic');
            });
            eyelid2.tween({ scaleX: 1.3, scaleY: 1.3 }, 120, 'easeOutCubic', () => {
                eyelid2.tween({ scaleX: 1, scaleY: 0.01 }, 180, 'easeOutCubic', () => {
                    blink();
                });
            });
        }

        function blink2() {
            eyelid1.tween({ scaleY: 1.5 }, 120, 'easeOutCubic', () => {
                eyelid1.tween({ scaleY: 0.01 }, 180, 'easeOutCubic');
            });
            eyelid2.tween({ scaleX: 1.3, scaleY: 1.3 }, 180, 'easeOutCubic', () => {
                eyelid2.tween({ scaleX: 1, scaleY: 0.01 }, 240, 'easeOutCubic', () => {
                    blink();
                });
            });
        }

        this.animateIn = () => {
            blink();
            this.tween({ opacity: 1 }, 1000, 'easeOutSine');
        };

        this.animateOut = callback => {
            this.tween({ opacity: 0 }, 500, 'easeInOutQuad', () => {
                this.clearTimers();
                if (callback) callback();
            });
        };

        this.ready = initImages;
    }
}

class Loader extends Interface {

    constructor() {
        super('Loader');
        const self = this;
        let alienkitty, number, title, loader;

        initHTML();
        initViews();
        initNumber();
        initTitle();
        initLoader();

        function initHTML() {
            self.size('100%');
            self.progress = 0;
        }

        function initViews() {
            alienkitty = self.initClass(AlienKitty);
            alienkitty.css({ marginTop: -108 });
            alienkitty.ready().then(alienkitty.animateIn);
        }

        function initNumber() {
            number = self.create('.number');
            number.size(150, 25).center();
            number.inner = number.create('.inner');
            number.inner.fontStyle('Lato', 12, Config.UI_COLOR);
            number.inner.css({
                width: '100%',
                fontWeight: '700',
                lineHeight: 25,
                letterSpacing: 12 * 0.03,
                textAlign: 'center',
                whiteSpace: 'nowrap'
            });
            number.inner.text('');
        }

        function initTitle() {
            title = self.create('.title');
            title.size(600, 25).center().css({ opacity: 0 });
            title.inner = title.create('.inner');
            title.inner.fontStyle('Lato', 12, Config.UI_COLOR);
            title.inner.css({
                width: '100%',
                fontWeight: '700',
                lineHeight: 25,
                letterSpacing: 12 * 0.03,
                textAlign: 'center',
                whiteSpace: 'nowrap'
            });
            title.inner.text(Device.mobile ? 'Put on your headphones' : 'Turn up your speakers');
        }

        function initLoader() {
            loader = self.initClass(AssetLoader, Config.ASSETS);
            loader.events.add(Events.PROGRESS, loadUpdate);
        }

        function loadUpdate(e) {
            TweenManager.tween(self, { progress: e.percent }, 2000, 'easeInOutSine', null, () => {
                number.inner.text(Math.round(self.progress * 100));
                if (self.progress === 1) {
                    self.events.fire(Events.COMPLETE);
                    addStartButton();
                }
            });
        }

        function addStartButton() {
            number.tween({ opacity: 0 }, 200, 'easeOutSine', () => {
                number.hide();
                title.transform({ y: 10 }).css({ opacity: 0 }).tween({ y: 0, opacity: 1 }, 1000, 'easeOutQuart', 100);
                Mouse.input.events.add(Interaction.CLICK, click);
                self.delayedCall(() => swapTitle((Device.mobile ? 'Tap' : 'Click') + ' anywhere'), 7000);
                self.delayedCall(() => swapTitle(Device.mobile ? 'Tap tap!' : 'Click!'), 14000);
            });
        }

        function click() {
            Mouse.input.events.remove(Interaction.CLICK, click);
            Stage.events.fire(Events.START);
            WebAudio.trigger('BassDrum');
        }

        function swapTitle(text) {
            title.tween({ y: -10, opacity: 0 }, 300, 'easeInSine', () => {
                title.inner.text(text);
                title.transform({ y: 10 }).tween({ y: 0, opacity: 1 }, 1000, 'easeOutCubic');
            });
        }

        this.animateOut = callback => {
            title.tween({ opacity: 0 }, 200, 'easeOutSine');
            alienkitty.animateOut(callback);
        };
    }
}

class Main {

    constructor() {

        if (!Device.webgl) window.location = 'fallback.html';
        //else console.log(Device.webgl);

        let loader, beam;

        WebAudio.init();

        initStage();
        initLoader();
        addListeners();

        function initStage() {
            Stage.size('100%');

            Mouse.init();
            Accelerometer.init();
        }

        function initLoader() {
            FontLoader.loadFonts(['Lato']).then(() => {
                loader = Stage.initClass(Loader);
                loader.events.add(Events.COMPLETE, initWorld);
            });
        }

        function initWorld() {
            World.instance();

            beam = Stage.initClass(ColourBeam);
        }

        function addListeners() {
            Stage.events.add(Events.START, start);
            Stage.events.add(Events.VISIBILITY, visibility);
        }

        function start() {
            loader.animateOut(() => {
                loader = loader.destroy();
                beam.animateIn();

                UI.instance();

                World.instance().initAudio();
                beam.initAudio();
            });
        }

        function visibility(e) {
            if (e.type === 'blur') WebAudio.mute();
            else WebAudio.unmute();
        }
    }
}

window.onload = () => new Main();
