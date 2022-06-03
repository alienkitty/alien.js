import { ACESFilmicToneMapping, AmbientLight, Assets, BloomCompositeMaterial, BoxGeometry, Color, Component, Device, DirectionalLight, EnvironmentTextureLoader, Events, FXAAMaterial, GLSL3, Global, Group, Header, HemisphereLight, IcosahedronGeometry, ImageBitmapLoaderThread, Interface, LuminosityMaterial, Mesh, MeshStandardMaterial, NoBlending, OctahedronGeometry, OrthographicCamera, PanelItem, PerspectiveCamera, RawShaderMaterial, RepeatWrapping, Scene, SceneCompositeMaterial, SmoothViews, Stage, TextureLoader, Thread, Uniform, UnrealBloomBlurMaterial, Vector2, WebGLRenderTarget, WebGLRenderer, defer, degToRad, floorPowerOfTwo, getFullscreenTriangle, lerp, shuffle, ticker } from '../../../build/alien.js';

Global.SECTIONS = [];
Global.SECTION_INDEX = 0;

class Config {
    static BREAKPOINT = 1000;

    static DEBUG = location.search === '?debug';
}

class Data {
    static init() {
        this.setIndexes();
    }

    static setIndexes() {
        Global.SECTIONS.forEach((item, i) => item.index = i);
    }

    /**
     * Public methods
     */

    static setSection = index => {
        if (index !== Global.SECTION_INDEX) {
            Global.SECTION_INDEX = index;

            RenderManager.setView(index);
        }
    };

    static getNext = () => {
        let index = Global.SECTION_INDEX + 1;

        if (index > Global.SECTIONS.length - 1) {
            index = 0;
        }

        return Global.SECTIONS[index];
    };
}

class UINext extends Interface {
    constructor() {
        super('.next');

        this.initHTML();

        this.addListeners();
    }

    initHTML() {
        this.css({
            position: 'relative',
            display: 'inline-block',
            padding: 10,
            fontFamily: 'Gothic A1, sans-serif',
            fontWeight: '400',
            fontSize: 13,
            lineHeight: '1.4',
            letterSpacing: '0.03em',
            textTransform: 'uppercase',
            cursor: 'pointer'
        });
        this.text('Next');

        this.line = new Interface('.line');
        this.line.css({
            left: 10,
            right: 10,
            bottom: 10,
            height: 1,
            backgroundColor: 'var(--ui-color)',
            scaleX: 0
        });
        this.add(this.line);
    }

    addListeners() {
        this.element.addEventListener('mouseenter', this.onHover);
        this.element.addEventListener('mouseleave', this.onHover);
        this.element.addEventListener('click', this.onClick);
    }

    /**
     * Event handlers
     */

    onHover = ({ type }) => {
        this.line.clearTween();

        if (type === 'mouseenter') {
            this.line.css({ transformOrigin: 'left center', scaleX: 0 }).tween({ scaleX: 1 }, 800, 'easeOutQuint');
        } else {
            this.line.css({ transformOrigin: 'right center' }).tween({ scaleX: 0 }, 500, 'easeOutQuint');
        }
    };

    onClick = e => {
        e.preventDefault();

        const item = Data.getNext();

        Data.setSection(item.index);
    };
}

class UITitle extends Interface {
    constructor(title) {
        super('.title', 'h1');

        this.title = title;
        this.letters = [];

        this.initHTML();
        this.initText();
    }

    initHTML() {
        this.invisible();
        this.css({
            position: 'relative',
            margin: 0,
            fontFamily: 'Roboto, sans-serif',
            fontWeight: '300',
            fontSize: 23,
            lineHeight: '1.3',
            letterSpacing: 'normal',
            textTransform: 'uppercase',
            pointerEvents: 'none',
            opacity: 0
        });
    }

    initText() {
        const split = this.title.replace(/[\s.]+/g, '_').split('');

        split.forEach(str => {
            if (str === ' ') {
                str = '&nbsp';
            }

            const letter = new Interface(null, 'span');
            letter.html(str);
            this.add(letter);

            this.letters.push(letter);
        });
    }

    /**
     * Public methods
     */

    setTitle = title => {
        this.title = title;
        this.letters = [];

        this.clearTween().tween({ y: -10, opacity: 0 }, 300, 'easeInSine', () => {
            this.empty();
            this.initText();
            this.animateIn();
            this.css({ y: 10 }).tween({ y: 0, opacity: 1 }, 1000, 'easeOutCubic');
        });
    };

    animateIn = () => {
        this.visible();
        this.css({ pointerEvents: 'auto' });

        shuffle(this.letters);

        const underscores = this.letters.filter(letter => letter === '_');

        underscores.forEach((letter, i) => {
            if (!letter.element) {
                return;
            }

            letter.css({ opacity: 0 }).tween({ opacity: 1 }, 2000, 'easeOutCubic', i * 15);
        });

        const letters = this.letters.filter(letter => letter !== '_').slice(0, 2);

        letters.forEach((letter, i) => {
            if (!letter.element) {
                return;
            }

            letter.css({ opacity: 0 }).tween({ opacity: 1 }, 2000, 'easeOutCubic', 100 + i * 15);
        });

        this.clearTween().tween({ opacity: 1 }, 1000, 'easeOutSine');
    };

    animateOut = callback => {
        this.css({ pointerEvents: 'none' });

        this.clearTween().tween({ opacity: 0 }, 300, 'easeInSine', () => {
            this.invisible();

            if (callback) {
                callback();
            }
        });
    };
}

class UI extends Interface {
    constructor() {
        super('.ui');

        this.initHTML();
        this.initViews();

        this.addListeners();
        this.onResize();
    }

    initHTML() {
        this.invisible();
        this.css({
            position: 'fixed',
            left: 0,
            top: 0,
            width: '100%',
            height: '100%',
            textAlign: 'center',
            pointerEvents: 'none',
            opacity: 0
        });

        this.container = new Interface('.container');
        this.container.css({
            position: 'relative',
            margin: '23px 0 0',
            textAlign: 'center'
        });
        this.add(this.container);
    }

    initViews() {
        this.header = new Header();
        this.add(this.header);

        this.title = new UITitle(Global.SECTIONS[Global.SECTION_INDEX].title);
        this.container.add(this.title);

        this.link = new UINext();
        this.container.add(this.link);
    }

    addListeners() {
        Stage.events.on(Events.VIEW_CHANGE, this.onViewChange);
        Stage.events.on(Events.RESIZE, this.onResize);
    }

    /**
     * Event handlers
     */

    onViewChange = ({ index }) => {
        this.clearTimeout(this.timeout);

        this.timeout = this.delayedCall(300, () => {
            this.title.setTitle(Global.SECTIONS[index].title);
        });
    };

    onResize = () => {
        if (Stage.width < Config.BREAKPOINT) {
            this.container.css({
                margin: '24px 0 0'
            });

            this.link.css({
                marginTop: Stage.height - 24 * 2 - 70
            });
        } else {
            this.container.css({
                margin: '55px 0 0'
            });

            this.link.css({
                marginTop: Stage.height - 55 * 2 - 70
            });
        }
    };

    /**
     * Public methods
     */

    addPanel = item => {
        this.header.info.panel.add(item);
    };

    update = () => {
        this.header.info.update();
    };

    animateIn = () => {
        this.visible();
        this.css({
            pointerEvents: 'auto',
            opacity: 1
        });

        const duration = 2000;
        const stagger = 175;

        this.children.forEach((view, i) => {
            view.css({ opacity: 0 }).tween({ opacity: 1 }, duration, 'easeOutCubic', i * stagger);
        });

        this.header.animateIn();
    };
}

class Section extends Interface {
    constructor({ title, index }) {
        super('.section');

        this.title = title;
        this.index = index;

        this.initHTML();
        this.initViews();

        this.addListeners();
    }

    initHTML() {
        this.css({
            position: 'relative',
            width: '100%',
            height: '100vh'
        });

        if (Config.DEBUG) {
            this.css({
                backgroundColor: `rgba(
                    ${Math.floor(Math.random() * 255)},
                    ${Math.floor(Math.random() * 255)},
                    ${Math.floor(Math.random() * 255)},
                    0.5
                )`
            });
        }
    }

    initViews() {
    }

    async addListeners() {
        await defer();

        this.observer = new IntersectionObserver(this.onIntersect, {
            threshold: 0.5
        });
        this.observer.observe(this.element);
    }

    /**
     * Event handlers
     */

    onIntersect = ([entry]) => {
        if (entry.isIntersecting) {
            Stage.events.emit(Events.VIEW_CHANGE, { index: this.index });
        }
    };
}

class Container extends Interface {
    constructor() {
        super('.container');

        this.initHTML();
        this.initViews();
    }

    initHTML() {
        this.css({ position: 'static' });
    }

    initViews() {
        this.darkPlanet = new Section(Global.SECTIONS[0]);
        this.add(this.darkPlanet);

        this.floatingCrystal = new Section(Global.SECTIONS[1]);
        this.add(this.floatingCrystal);

        this.abstractCube = new Section(Global.SECTIONS[2]);
        this.add(this.abstractCube);
    }
}

const vertexTransitionShader = /* glsl */`
    in vec3 position;
    in vec2 uv;

    out vec2 vUv;

    void main() {
        vUv = uv;

        gl_Position = vec4(position, 1.0);
    }
`;

const fragmentTransitionShader = /* glsl */`
    precision highp float;

    uniform sampler2D tMap1;
    uniform sampler2D tMap2;
    uniform float uProgress;
    uniform vec2 uResolution;
    uniform float uTime;

    in vec2 vUv;

    out vec4 FragColor;

    // Based on https://gl-transitions.com/editor/flyeye by gre

    uniform float uSize;
    uniform float uZoom;
    uniform float uColorSeparation;

    void main() {
        if (uProgress == 0.0) {
            FragColor = texture(tMap1, vUv);
            return;
        } else if (uProgress == 1.0) {
            FragColor = texture(tMap2, vUv);
            return;
        }

        float inv = 1.0 - uProgress;
        vec2 disp = uSize * vec2(cos(uZoom * vUv.x), sin(uZoom * vUv.y));

        vec4 texTo = texture(tMap2, vUv + inv * disp);
        vec4 texFrom = vec4(
            texture(tMap1, vUv + uProgress * disp * (1.0 - uColorSeparation)).r,
            texture(tMap1, vUv + uProgress * disp).g,
            texture(tMap1, vUv + uProgress * disp * (1.0 + uColorSeparation)).b,
            1.0
        );

        FragColor = texTo * uProgress + texFrom * inv;
    }
`;

class TransitionMaterial extends RawShaderMaterial {
    constructor() {
        super({
            glslVersion: GLSL3,
            uniforms: {
                tMap1: new Uniform(null),
                tMap2: new Uniform(null),
                uProgress: new Uniform(0),
                uSize: new Uniform(0.04),
                uZoom: new Uniform(50),
                uColorSeparation: new Uniform(0.3),
                uResolution: new Uniform(new Vector2()),
                uTime: new Uniform(0)
            },
            vertexShader: vertexTransitionShader,
            fragmentShader: fragmentTransitionShader,
            blending: NoBlending,
            depthWrite: false,
            depthTest: false
        });
    }
}

class RenderScene {
    constructor() {
        this.initRenderer();
        this.initLights();
        this.initEnvironment();
    }

    initRenderer() {
        const { renderer, camera } = WorldController;

        this.renderer = renderer;
        this.camera = camera;

        // 3D scene
        this.scene = new Scene();
        this.scene.background = new Color(0x0e0e0e);

        // Render targets
        this.renderTarget = new WebGLRenderTarget(1, 1);
    }

    initLights() {
        this.scene.add(new AmbientLight(0xffffff, 0.2));

        this.scene.add(new HemisphereLight(0x606060, 0x404040));

        const light = new DirectionalLight(0xffffff, 0.4);
        light.position.set(0.6, 0.5, 1);
        this.scene.add(light);
    }

    async initEnvironment() {
        const { loadEnvironmentTexture } = WorldController;

        this.scene.environment = await loadEnvironmentTexture('assets/textures/env.jpg');
    }

    /**
     * Public methods
     */

    resize(width, height, dpr) {
        width = Math.round(width * dpr);
        height = Math.round(height * dpr);

        this.renderTarget.setSize(width, height);
    }

    update() {
        const currentRenderTarget = this.renderer.getRenderTarget();

        // Scene pass
        this.renderer.setRenderTarget(this.renderTarget);
        this.renderer.render(this.scene, this.camera);

        // Restore renderer settings
        this.renderer.setRenderTarget(currentRenderTarget);
    }
}

class AbstractCube extends Group {
    constructor() {
        super();
    }

    async initMesh() {
        const { anisotropy, loadTexture } = WorldController;

        const geometry = new BoxGeometry();

        // 2nd set of UV's for aoMap and lightMap
        geometry.attributes.uv2 = geometry.attributes.uv;

        // Textures
        const [map, normalMap, ormMap] = await Promise.all([
            // loadTexture('assets/textures/uv.jpg'),
            loadTexture('assets/textures/pbr/pitted_metal_basecolor.jpg'),
            loadTexture('assets/textures/pbr/pitted_metal_normal.jpg'),
            // https://occlusion-roughness-metalness.glitch.me/
            loadTexture('assets/textures/pbr/pitted_metal_orm.jpg')
        ]);

        map.anisotropy = anisotropy;
        normalMap.anisotropy = anisotropy;
        ormMap.anisotropy = anisotropy;

        const material = new MeshStandardMaterial({
            color: new Color().offsetHSL(0, 0, -0.65),
            roughness: 0.7,
            metalness: 0.6,
            map,
            aoMap: ormMap,
            aoMapIntensity: 1,
            roughnessMap: ormMap,
            metalnessMap: ormMap,
            normalMap,
            normalScale: new Vector2(1, 1),
            envMapIntensity: 1,
            flatShading: true
        });

        const mesh = new Mesh(geometry, material);
        mesh.rotation.x = degToRad(-45);
        mesh.rotation.z = degToRad(-45);
        this.add(mesh);

        this.mesh = mesh;
    }

    /**
     * Public methods
     */

    update = () => {
        this.mesh.rotation.y -= 0.005;
    };
}

class AbstractCubeScene extends RenderScene {
    constructor() {
        super();

        this.scene.visible = false;

        this.initViews();
    }

    initViews() {
        this.abstractCube = new AbstractCube();
        this.scene.add(this.abstractCube);
    }

    /**
     * Public methods
     */

    update = time => {
        if (!this.scene.visible) {
            return;
        }

        this.abstractCube.update(time);

        super.update();
    };

    ready = async () => {
        await Promise.all([
            this.abstractCube.initMesh()
        ]);

        this.scene.visible = true;
        super.update();
        this.scene.visible = false;
    };
}

class FloatingCrystal extends Group {
    constructor() {
        super();
    }

    async initMesh() {
        const { anisotropy, loadTexture } = WorldController;

        const geometry = new OctahedronGeometry();

        // 2nd set of UV's for aoMap and lightMap
        geometry.attributes.uv2 = geometry.attributes.uv;

        // Textures
        const [map, normalMap, ormMap] = await Promise.all([
            // loadTexture('assets/textures/uv.jpg'),
            loadTexture('assets/textures/pbr/pitted_metal_basecolor.jpg'),
            loadTexture('assets/textures/pbr/pitted_metal_normal.jpg'),
            // https://occlusion-roughness-metalness.glitch.me/
            loadTexture('assets/textures/pbr/pitted_metal_orm.jpg')
        ]);

        map.anisotropy = anisotropy;
        map.wrapS = RepeatWrapping;
        map.wrapT = RepeatWrapping;
        map.repeat.set(2, 1);

        normalMap.anisotropy = anisotropy;
        normalMap.wrapS = RepeatWrapping;
        normalMap.wrapT = RepeatWrapping;
        normalMap.repeat.set(2, 1);

        ormMap.anisotropy = anisotropy;
        ormMap.wrapS = RepeatWrapping;
        ormMap.wrapT = RepeatWrapping;
        ormMap.repeat.set(2, 1);

        const material = new MeshStandardMaterial({
            color: new Color().offsetHSL(0, 0, -0.65),
            roughness: 0.7,
            metalness: 0.6,
            map,
            aoMap: ormMap,
            aoMapIntensity: 1,
            roughnessMap: ormMap,
            metalnessMap: ormMap,
            normalMap,
            normalScale: new Vector2(1, 1),
            envMapIntensity: 1,
            flatShading: true
        });

        const mesh = new Mesh(geometry, material);
        mesh.scale.set(0.5, 1, 0.5);
        this.add(mesh);

        this.mesh = mesh;
    }

    /**
     * Public methods
     */

    update = time => {
        this.mesh.position.y = Math.sin(time) * 0.1;
        this.mesh.rotation.y += 0.01;
    };
}

class FloatingCrystalScene extends RenderScene {
    constructor() {
        super();

        this.scene.visible = false;

        this.initViews();
    }

    initViews() {
        this.floatingCrystal = new FloatingCrystal();
        this.scene.add(this.floatingCrystal);
    }

    /**
     * Public methods
     */

    update = time => {
        if (!this.scene.visible) {
            return;
        }

        this.floatingCrystal.update(time);

        super.update();
    };

    ready = async () => {
        await Promise.all([
            this.floatingCrystal.initMesh()
        ]);

        this.scene.visible = true;
        super.update();
        this.scene.visible = false;
    };
}

class DarkPlanet extends Group {
    constructor() {
        super();

        // 25 degree tilt like Mars
        this.rotation.z = degToRad(25);
    }

    async initMesh() {
        const { anisotropy, loadTexture } = WorldController;

        const geometry = new IcosahedronGeometry(0.6, 12);

        // 2nd set of UV's for aoMap and lightMap
        geometry.attributes.uv2 = geometry.attributes.uv;

        // Textures
        const [map, normalMap, ormMap] = await Promise.all([
            // loadTexture('assets/textures/uv.jpg'),
            loadTexture('assets/textures/pbr/pitted_metal_basecolor.jpg'),
            loadTexture('assets/textures/pbr/pitted_metal_normal.jpg'),
            // https://occlusion-roughness-metalness.glitch.me/
            loadTexture('assets/textures/pbr/pitted_metal_orm.jpg')
        ]);

        map.anisotropy = anisotropy;
        map.wrapS = RepeatWrapping;
        map.wrapT = RepeatWrapping;
        map.repeat.set(2, 1);

        normalMap.anisotropy = anisotropy;
        normalMap.wrapS = RepeatWrapping;
        normalMap.wrapT = RepeatWrapping;
        normalMap.repeat.set(2, 1);

        ormMap.anisotropy = anisotropy;
        ormMap.wrapS = RepeatWrapping;
        ormMap.wrapT = RepeatWrapping;
        ormMap.repeat.set(2, 1);

        const material = new MeshStandardMaterial({
            color: new Color().offsetHSL(0, 0, -0.65),
            roughness: 2,
            metalness: 0.6,
            map,
            aoMap: ormMap,
            aoMapIntensity: 1,
            roughnessMap: ormMap,
            metalnessMap: ormMap,
            normalMap,
            normalScale: new Vector2(3, 3),
            envMapIntensity: 1
        });

        const mesh = new Mesh(geometry, material);
        this.add(mesh);

        this.mesh = mesh;
    }

    /**
     * Public methods
     */

    update = () => {
        // Counter clockwise rotation
        this.mesh.rotation.y += 0.005;
    };
}

class DarkPlanetScene extends RenderScene {
    constructor() {
        super();

        this.scene.visible = false;

        this.initViews();
    }

    initViews() {
        this.darkPlanet = new DarkPlanet();
        this.scene.add(this.darkPlanet);
    }

    /**
     * Public methods
     */

    update = time => {
        if (!this.scene.visible) {
            return;
        }

        this.darkPlanet.update(time);

        super.update();
    };

    ready = async () => {
        await Promise.all([
            this.darkPlanet.initMesh()
        ]);

        this.scene.visible = true;
        super.update();
        this.scene.visible = false;
    };
}

class SceneView extends Component {
    constructor() {
        super();

        this.initViews();
    }

    initViews() {
        this.darkPlanet = new DarkPlanetScene();
        this.add(this.darkPlanet);

        this.floatingCrystal = new FloatingCrystalScene();
        this.add(this.floatingCrystal);

        this.abstractCube = new AbstractCubeScene();
        this.add(this.abstractCube);
    }

    /**
     * Public methods
     */

    resize = (width, height, dpr) => {
        this.darkPlanet.resize(width, height, dpr);
        this.floatingCrystal.resize(width, height, dpr);
        this.abstractCube.resize(width, height, dpr);
    };

    update = time => {
        this.darkPlanet.update(time);
        this.floatingCrystal.update(time);
        this.abstractCube.update(time);
    };

    ready = () => Promise.all([
        this.darkPlanet.ready(),
        this.floatingCrystal.ready(),
        this.abstractCube.ready()
    ]);
}

class SceneController {
    static init(view) {
        this.view = view;
    }

    /**
     * Public methods
     */

    static resize = (width, height, dpr) => {
        this.view.resize(width, height, dpr);
    };

    static update = time => {
        this.view.update(time);
    };

    static animateIn = () => {
    };

    static ready = () => this.view.ready();
}

class PanelController {
    static init(ui) {
        this.ui = ui;

        this.initPanel();
    }

    static initPanel() {
        const { luminosityMaterial, bloomCompositeMaterial, transitionMaterial } = RenderManager;

        const items = [
            {
                label: 'FPS'
            },
            {
                type: 'divider'
            },
            {
                type: 'slider',
                label: 'Thresh',
                min: 0,
                max: 1,
                step: 0.01,
                value: RenderManager.luminosityThreshold,
                callback: value => {
                    luminosityMaterial.uniforms.uThreshold.value = value;
                }
            },
            {
                type: 'slider',
                label: 'Smooth',
                min: 0,
                max: 1,
                step: 0.01,
                value: RenderManager.luminositySmoothing,
                callback: value => {
                    luminosityMaterial.uniforms.uSmoothing.value = value;
                }
            },
            {
                type: 'slider',
                label: 'Strength',
                min: 0,
                max: 1,
                step: 0.01,
                value: RenderManager.bloomStrength,
                callback: value => {
                    RenderManager.bloomStrength = value;
                    bloomCompositeMaterial.uniforms.uBloomFactors.value = RenderManager.bloomFactors();
                }
            },
            {
                type: 'slider',
                label: 'Radius',
                min: 0,
                max: 1,
                step: 0.01,
                value: RenderManager.bloomRadius,
                callback: value => {
                    RenderManager.bloomRadius = value;
                    bloomCompositeMaterial.uniforms.uBloomFactors.value = RenderManager.bloomFactors();
                }
            },
            {
                type: 'divider'
            },
            {
                type: 'slider',
                label: 'Size',
                min: 0,
                max: 1,
                step: 0.01,
                value: transitionMaterial.uniforms.uSize.value,
                callback: value => {
                    transitionMaterial.uniforms.uSize.value = value;
                }
            },
            {
                type: 'slider',
                label: 'Zoom',
                min: 0,
                max: 100,
                step: 0.2,
                value: transitionMaterial.uniforms.uZoom.value,
                callback: value => {
                    transitionMaterial.uniforms.uZoom.value = value;
                }
            },
            {
                type: 'slider',
                label: 'Chroma',
                min: 0,
                max: 2,
                step: 0.01,
                value: transitionMaterial.uniforms.uColorSeparation.value,
                callback: value => {
                    transitionMaterial.uniforms.uColorSeparation.value = value;
                }
            },
            {
                type: 'divider'
            },
            {
                type: 'slider',
                label: 'Lerp',
                min: 0,
                max: 1,
                step: 0.01,
                value: RenderManager.smooth.lerpSpeed,
                callback: value => {
                    RenderManager.smooth.lerpSpeed = value;
                }
            }
        ];

        items.forEach(data => {
            this.ui.addPanel(new PanelItem(data));
        });
    }
}

const BlurDirectionX = new Vector2(1, 0);
const BlurDirectionY = new Vector2(0, 1);

class RenderManager {
    static init(renderer, view, container) {
        this.renderer = renderer;
        this.views = view.children;
        this.container = container;
        this.sections = container.children;

        this.luminosityThreshold = 0.1;
        this.luminositySmoothing = 1;
        this.bloomStrength = 0.3;
        this.bloomRadius = 0.75;
        this.animatedIn = false;

        this.initRenderer();

        this.addListeners();
    }

    static initRenderer() {
        const { screenTriangle, resolution } = WorldController;

        // Fullscreen triangle
        this.screenScene = new Scene();
        this.screenCamera = new OrthographicCamera(-1, 1, 1, -1, 0, 1);

        this.screen = new Mesh(screenTriangle);
        this.screen.frustumCulled = false;
        this.screenScene.add(this.screen);

        // Render targets
        this.renderTargetA = new WebGLRenderTarget(1, 1, {
            depthBuffer: false
        });

        this.renderTargetB = this.renderTargetA.clone();

        this.renderTargetsHorizontal = [];
        this.renderTargetsVertical = [];
        this.nMips = 5;

        this.renderTargetBright = this.renderTargetA.clone();

        for (let i = 0, l = this.nMips; i < l; i++) {
            this.renderTargetsHorizontal.push(this.renderTargetA.clone());
            this.renderTargetsVertical.push(this.renderTargetA.clone());
        }

        this.renderTargetA.depthBuffer = true;

        // Transition material
        this.transitionMaterial = new TransitionMaterial();

        // FXAA material
        this.fxaaMaterial = new FXAAMaterial();
        this.fxaaMaterial.uniforms.uResolution = resolution;

        // Luminosity high pass material
        this.luminosityMaterial = new LuminosityMaterial();
        this.luminosityMaterial.uniforms.uThreshold.value = this.luminosityThreshold;
        this.luminosityMaterial.uniforms.uSmoothing.value = this.luminositySmoothing;

        // Separable Gaussian blur materials
        this.blurMaterials = [];

        const kernelSizeArray = [3, 5, 7, 9, 11];

        for (let i = 0, l = this.nMips; i < l; i++) {
            this.blurMaterials.push(new UnrealBloomBlurMaterial(kernelSizeArray[i]));
        }

        // Bloom composite material
        this.bloomCompositeMaterial = new BloomCompositeMaterial();
        this.bloomCompositeMaterial.uniforms.tBlur1.value = this.renderTargetsVertical[0].texture;
        this.bloomCompositeMaterial.uniforms.tBlur2.value = this.renderTargetsVertical[1].texture;
        this.bloomCompositeMaterial.uniforms.tBlur3.value = this.renderTargetsVertical[2].texture;
        this.bloomCompositeMaterial.uniforms.tBlur4.value = this.renderTargetsVertical[3].texture;
        this.bloomCompositeMaterial.uniforms.tBlur5.value = this.renderTargetsVertical[4].texture;
        this.bloomCompositeMaterial.uniforms.uBloomFactors.value = this.bloomFactors();

        // Composite material
        this.compositeMaterial = new SceneCompositeMaterial();
    }

    static bloomFactors() {
        const bloomFactors = [1, 0.8, 0.6, 0.4, 0.2];

        for (let i = 0, l = this.nMips; i < l; i++) {
            const factor = bloomFactors[i];
            bloomFactors[i] = this.bloomStrength * lerp(factor, 1.2 - factor, this.bloomRadius);
        }

        return bloomFactors;
    }

    static addListeners() {
        this.smooth = new SmoothViews({
            views: this.views,
            root: Stage,
            container: this.container,
            sections: this.sections,
            lerpSpeed: 0.075
        });
    }

    /**
     * Public methods
     */

    static setView = index => {
        this.smooth.setScroll(index);
    };

    static resize = (width, height, dpr) => {
        this.renderer.setPixelRatio(dpr);
        this.renderer.setSize(width, height);

        width = Math.round(width * dpr);
        height = Math.round(height * dpr);

        this.renderTargetA.setSize(width, height);
        this.renderTargetB.setSize(width, height);

        width = floorPowerOfTwo(width) / 2;
        height = floorPowerOfTwo(height) / 2;

        this.renderTargetBright.setSize(width, height);

        for (let i = 0, l = this.nMips; i < l; i++) {
            this.renderTargetsHorizontal[i].setSize(width, height);
            this.renderTargetsVertical[i].setSize(width, height);

            this.blurMaterials[i].uniforms.uResolution.value.set(width, height);

            width = width / 2;
            height = height / 2;
        }
    };

    static update = () => {
        if (!this.animatedIn) {
            return;
        }

        const renderer = this.renderer;

        const screenScene = this.screenScene;
        const screenCamera = this.screenCamera;

        const renderTargetA = this.renderTargetA;
        const renderTargetB = this.renderTargetB;
        const renderTargetBright = this.renderTargetBright;
        const renderTargetsHorizontal = this.renderTargetsHorizontal;
        const renderTargetsVertical = this.renderTargetsVertical;

        // Toggle visibility when switching sections
        if (this.index1 !== this.smooth.index1) {
            this.views[this.index1].scene.visible = false;
            this.views[this.index2].scene.visible = false;

            this.index1 = this.smooth.index1;
            this.index2 = this.smooth.index2;

            this.views[this.index1].scene.visible = true;
            this.views[this.index2].scene.visible = true;
        }

        // Scene composite pass
        this.transitionMaterial.uniforms.tMap1.value = this.views[this.index1].renderTarget.texture;
        this.transitionMaterial.uniforms.tMap2.value = this.views[this.index2].renderTarget.texture;
        this.transitionMaterial.uniforms.uProgress.value = this.smooth.progress;
        this.screen.material = this.transitionMaterial;
        renderer.setRenderTarget(renderTargetA);
        renderer.render(screenScene, screenCamera);

        // FXAA pass
        this.fxaaMaterial.uniforms.tMap.value = renderTargetA.texture;
        this.screen.material = this.fxaaMaterial;
        renderer.setRenderTarget(renderTargetB);
        renderer.render(screenScene, screenCamera);

        // Extract bright areas
        this.luminosityMaterial.uniforms.tMap.value = renderTargetB.texture;
        this.screen.material = this.luminosityMaterial;
        renderer.setRenderTarget(renderTargetBright);
        renderer.render(screenScene, screenCamera);

        // Blur all the mips progressively
        let inputRenderTarget = renderTargetBright;

        for (let i = 0, l = this.nMips; i < l; i++) {
            this.screen.material = this.blurMaterials[i];

            this.blurMaterials[i].uniforms.tMap.value = inputRenderTarget.texture;
            this.blurMaterials[i].uniforms.uDirection.value = BlurDirectionX;
            renderer.setRenderTarget(renderTargetsHorizontal[i]);
            renderer.render(screenScene, screenCamera);

            this.blurMaterials[i].uniforms.tMap.value = this.renderTargetsHorizontal[i].texture;
            this.blurMaterials[i].uniforms.uDirection.value = BlurDirectionY;
            renderer.setRenderTarget(renderTargetsVertical[i]);
            renderer.render(screenScene, screenCamera);

            inputRenderTarget = renderTargetsVertical[i];
        }

        // Composite all the mips
        this.screen.material = this.bloomCompositeMaterial;
        renderer.setRenderTarget(renderTargetsHorizontal[0]);
        renderer.render(screenScene, screenCamera);

        // Composite pass (render to screen)
        this.compositeMaterial.uniforms.tScene.value = renderTargetB.texture;
        this.compositeMaterial.uniforms.tBloom.value = renderTargetsHorizontal[0].texture;
        this.screen.material = this.compositeMaterial;
        renderer.setRenderTarget(null);
        renderer.render(screenScene, screenCamera);
    };

    static animateIn = () => {
        this.index1 = 0;
        this.index2 = 1;
        this.views[this.index1].scene.visible = true;
        this.views[this.index2].scene.visible = true;
        this.animatedIn = true;
    };
}

class WorldController {
    static init() {
        this.initWorld();
        this.initLoaders();

        this.addListeners();
    }

    static initWorld() {
        this.renderer = new WebGLRenderer({
            powerPreference: 'high-performance',
            stencil: false
        });
        this.element = this.renderer.domElement;

        // Tone mapping
        this.renderer.toneMapping = ACESFilmicToneMapping;
        this.renderer.toneMappingExposure = 1;

        // Global 3D camera
        this.camera = new PerspectiveCamera(30);
        this.camera.near = 0.5;
        this.camera.far = 40;
        this.camera.position.z = 8;

        // Global geometries
        this.screenTriangle = getFullscreenTriangle();

        // Global uniforms
        this.resolution = new Uniform(new Vector2());
        this.aspect = new Uniform(1);
        this.time = new Uniform(0);
        this.frame = new Uniform(0);

        // Global settings
        this.anisotropy = this.renderer.capabilities.getMaxAnisotropy();
    }

    static initLoaders() {
        this.textureLoader = new TextureLoader();
        this.environmentLoader = new EnvironmentTextureLoader(this.renderer);
    }

    static addListeners() {
        this.renderer.domElement.addEventListener('touchstart', this.onTouchStart);
    }

    /**
     * Event handlers
     */

    static onTouchStart = e => {
        e.preventDefault();
    };

    /**
     * Public methods
     */

    static resize = (width, height, dpr) => {
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();

        width = Math.round(width * dpr);
        height = Math.round(height * dpr);

        this.resolution.value.set(width, height);
        this.aspect.value = width / height;
    };

    static update = (time, delta, frame) => {
        this.time.value = time;
        this.frame.value = frame;
    };

    static getTexture = (path, callback) => this.textureLoader.load(path, callback);

    static loadTexture = path => this.textureLoader.loadAsync(path);

    static loadEnvironmentTexture = path => this.environmentLoader.loadAsync(path);
}

class App {
    static async init() {
        Assets.path = '/examples/';

        if (!Device.agent.includes('firefox')) {
            this.initThread();
        }

        this.initStage();
        this.initWorld();

        await this.loadData();

        this.initViews();
        this.initControllers();

        this.addListeners();
        this.onResize();

        await Promise.all([
            SceneController.ready(),
            WorldController.textureLoader.ready(),
            WorldController.environmentLoader.ready()
        ]);

        this.initPanel();

        this.animateIn();
    }

    static initThread() {
        ImageBitmapLoaderThread.init();

        Thread.shared();
    }

    static initStage() {
        Stage.init(document.querySelector('#root'));
        Stage.css({ opacity: 0 });
    }

    static initWorld() {
        WorldController.init();
        Stage.add(WorldController.element);
    }

    static initViews() {
        this.view = new SceneView();

        this.container = new Container();
        Stage.add(this.container);

        this.ui = new UI();
        Stage.add(this.ui);
    }

    static initControllers() {
        const { renderer } = WorldController;

        SceneController.init(this.view);
        RenderManager.init(renderer, this.view, this.container);
    }

    static initPanel() {
        PanelController.init(this.ui);
    }

    static async loadData() {
        const data = await Assets.loadData('transitions/data.json');

        data.pages.forEach(item => {
            Global.SECTIONS.push(item);
        });

        Data.init();
    }

    static addListeners() {
        Stage.events.on(Events.RESIZE, this.onResize);
        ticker.add(this.onUpdate);
    }

    /**
     * Event handlers
     */

    static onResize = () => {
        const { width, height, dpr } = Stage;

        WorldController.resize(width, height, dpr);
        SceneController.resize(width, height, dpr);
        RenderManager.resize(width, height, dpr);
    };

    static onUpdate = (time, delta, frame) => {
        WorldController.update(time, delta, frame);
        SceneController.update(time);
        RenderManager.update(time, delta, frame);
        this.ui.update();
    };

    /**
     * Public methods
     */

    static animateIn = () => {
        SceneController.animateIn();
        RenderManager.animateIn();
        this.ui.animateIn();

        Stage.tween({ opacity: 1 }, 1000, 'linear', () => {
            Stage.css({ opacity: '' });
        });
    };
}

App.init();
