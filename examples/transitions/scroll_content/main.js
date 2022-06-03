import { ACESFilmicToneMapping, AmbientLight, Assets, BloomCompositeMaterial, BlurMaterial, BoxGeometry, Color, Device, DirectionalLight, EnvironmentTextureLoader, Events, FXAAMaterial, GLSL3, Global, Group, HemisphereLight, IcosahedronGeometry, ImageBitmapLoaderThread, Interface, LuminosityMaterial, Mesh, MeshStandardMaterial, NoBlending, OctahedronGeometry, OrthographicCamera, PanelItem, PerspectiveCamera, RawShaderMaterial, RepeatWrapping, Scene, SceneCompositeMaterial, Smooth, Stage, TextureLoader, Thread, UI, Uniform, UnrealBloomBlurMaterial, Vector2, WebGLRenderTarget, WebGLRenderer, clamp, clearTween, defer, degToRad, floorPowerOfTwo, getFullscreenTriangle, inverseLerp, lerp, shuffle, ticker, tween } from '../../../build/alien.js';

Global.SECTIONS = [];
Global.SECTION_INDEX = 0;

class Config {
    static BREAKPOINT = 1000;

    static DEBUG = location.search === '?debug';
}

class DetailsLink extends Interface {
    constructor(title, link) {
        super('.link', 'a');

        this.title = title;
        this.link = link;

        this.initHTML();

        this.addListeners();
    }

    initHTML() {
        this.css({
            fontFamily: 'Gothic A1, sans-serif',
            fontWeight: '400',
            fontSize: 13,
            lineHeight: 22,
            letterSpacing: 'normal'
        });
        this.attr({ href: this.link });

        this.text = new Interface('.text');
        this.text.css({
            position: 'relative',
            display: 'inline-block'
        });
        this.text.text(this.title);
        this.add(this.text);

        this.line = new Interface('.line');
        this.line.css({
            position: 'relative',
            display: 'inline-block',
            fontWeight: '700',
            verticalAlign: 'middle'
        });
        this.line.html('&nbsp;&nbsp;―');
        this.add(this.line);
    }

    addListeners() {
        this.element.addEventListener('mouseenter', this.onHover);
        this.element.addEventListener('mouseleave', this.onHover);
    }

    /**
     * Event handlers
     */

    onHover = ({ type }) => {
        this.line.tween({ x: type === 'mouseenter' ? 10 : 0 }, 200, 'easeOutCubic');
    };
}

class DetailsTitle extends Interface {
    constructor(title) {
        super('.title', 'h1');

        this.title = title;
        this.letters = [];

        this.initHTML();
        this.initText();
    }

    initHTML() {
        this.css({
            position: 'relative',
            left: -1,
            margin: '0 0 6px',
            fontFamily: 'Roboto, sans-serif',
            fontWeight: '300',
            fontSize: 23,
            lineHeight: '1.3',
            letterSpacing: 'normal',
            textTransform: 'uppercase'
        });
    }

    initText() {
        const split = this.title.split('');

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

    animateIn = () => {
        shuffle(this.letters);

        const underscores = this.letters.filter(letter => letter === '_');

        underscores.forEach((letter, i) => {
            letter.css({ opacity: 0 }).tween({ opacity: 1 }, 2000, 'easeOutCubic', i * 15);
        });

        const letters = this.letters.filter(letter => letter !== '_').slice(0, 2);

        letters.forEach((letter, i) => {
            letter.css({ opacity: 0 }).tween({ opacity: 1 }, 2000, 'easeOutCubic', 100 + i * 15);
        });
    };
}

class Details extends Interface {
    constructor(title) {
        super('.details');

        this.title = title;
        this.texts = [];

        this.initHTML();
        this.initViews();

        this.addListeners();
        this.onResize();
    }

    initHTML() {
        this.invisible();
        this.css({
            left: 0,
            top: 0,
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            pointerEvents: 'none',
            opacity: 0
        });

        this.container = new Interface('.container');
        this.container.css({
            position: 'relative',
            width: 400,
            margin: '10% 10% 13%'
        });
        this.add(this.container);
    }

    initViews() {
        this.title = new DetailsTitle(this.title.replace(/[\s.]+/g, '_'));
        this.title.css({
            width: 'fit-content'
        });
        this.container.add(this.title);
        this.texts.push(this.title);

        this.text = new Interface('.text', 'p');
        this.text.css({
            width: 'fit-content',
            position: 'relative',
            margin: '6px 0',
            fontFamily: 'Gothic A1, sans-serif',
            fontWeight: '400',
            fontSize: 13,
            lineHeight: '1.5',
            letterSpacing: 'normal'
        });
        this.text.html('Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.');
        this.container.add(this.text);
        this.texts.push(this.text);

        const items = [
            {
                title: 'Lorem ipsum',
                link: 'https://en.wikipedia.org/wiki/Lorem_ipsum'
            }
        ];

        items.forEach(data => {
            const link = new DetailsLink(data.title, data.link);
            link.css({
                display: 'block',
                width: 'fit-content'
            });
            this.container.add(link);
            this.texts.push(link);
        });
    }

    addListeners() {
        Stage.events.on(Events.RESIZE, this.onResize);
    }

    /**
     * Event handlers
     */

    onResize = () => {
        if (Stage.width < Config.BREAKPOINT) {
            this.css({ display: '' });

            this.container.css({
                width: '',
                margin: '24px 20px 0'
            });
        } else {
            this.css({ display: 'flex' });

            this.container.css({
                width: 400,
                margin: '10% 10% 13%'
            });
        }
    };

    /**
     * Public methods
     */

    animateIn = () => {
        this.visible();
        this.css({
            pointerEvents: 'auto',
            opacity: 1
        });

        const duration = 2000;
        const stagger = 175;

        this.texts.forEach((text, i) => {
            const delay = i === 0 ? 0 : duration;

            text.css({ opacity: 0 }).tween({ opacity: 1 }, duration, 'easeOutCubic', delay + i * stagger);
        });

        this.title.animateIn();
    };
}

class Section extends Interface {
    constructor({ title, index }) {
        super('.section');

        this.title = title;
        this.index = index;
        this.animatedIn = false;

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
        this.details = new Details(this.title);
        this.add(this.details);
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

            if (!this.animatedIn) {
                this.animatedIn = true;

                this.details.animateIn();
            }
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

import rgbshift from '../../../src/shaders/modules/rgbshift/rgbshift.glsl.js';
import dither from '../../../src/shaders/modules/dither/dither.glsl.js';

const vertexCompositeShader = /* glsl */`
    in vec3 position;
    in vec2 uv;

    out vec2 vUv;

    void main() {
        vUv = uv;

        gl_Position = vec4(position, 1.0);
    }
`;

const fragmentCompositeShader = /* glsl */`
    precision highp float;

    uniform sampler2D tScene;
    uniform vec3 uColor;
    uniform float uDistortion;
    uniform float uOpacity;

    in vec2 vUv;

    out vec4 FragColor;

    ${rgbshift}
    ${dither}

    void main() {
        FragColor = getRGB(tScene, vUv, 0.1, 0.001 * uDistortion * (1.0 - uOpacity));

        FragColor.rgb = mix(uColor, FragColor.rgb, uOpacity);

        FragColor.rgb = dither(FragColor.rgb);
    }
`;

class CompositeMaterial extends RawShaderMaterial {
    constructor() {
        super({
            glslVersion: GLSL3,
            uniforms: {
                tScene: new Uniform(null),
                uColor: new Uniform(new Color(0x0e0e0e)),
                uDistortion: new Uniform(1.45),
                uOpacity: new Uniform(0)
            },
            vertexShader: vertexCompositeShader,
            fragmentShader: fragmentCompositeShader,
            blending: NoBlending,
            depthWrite: false,
            depthTest: false
        });
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

class SceneView extends Group {
    constructor() {
        super();

        this.visible = false;

        this.initViews();
    }

    initViews() {
        this.darkPlanet = new DarkPlanet();
        this.add(this.darkPlanet);

        this.floatingCrystal = new FloatingCrystal();
        this.add(this.floatingCrystal);

        this.abstractCube = new AbstractCube();
        this.add(this.abstractCube);
    }

    /**
     * Public methods
     */

    update = time => {
        this.darkPlanet.update(time);
        this.floatingCrystal.update(time);
        this.abstractCube.update(time);
    };

    ready = () => Promise.all([
        this.darkPlanet.initMesh(),
        this.floatingCrystal.initMesh(),
        this.abstractCube.initMesh()
    ]);
}

class SceneController {
    static init(view) {
        this.view = view;

        this.addListeners();
    }

    static addListeners() {
        Stage.events.on(Events.VIEW_CHANGE, this.onViewChange);
    }

    /**
     * Event handlers
     */

    static onViewChange = ({ index }) => {
        if (index !== Global.SECTION_INDEX) {
            Global.SECTION_INDEX = index;

            RenderManager.setView(index);
        }
    };

    /**
     * Public methods
     */

    static setView = index => {
        this.view.darkPlanet.visible = false;
        this.view.floatingCrystal.visible = false;
        this.view.abstractCube.visible = false;

        switch (index) {
            case 0:
                this.view.darkPlanet.visible = true;
                break;
            case 1:
                this.view.floatingCrystal.visible = true;
                break;
            case 2:
                this.view.abstractCube.visible = true;
                break;
        }
    };

    static resize = () => {
    };

    static update = time => {
        if (!this.view.visible) {
            return;
        }

        this.view.update(time);
    };

    static animateIn = () => {
        this.setView(Global.SECTION_INDEX);

        this.view.visible = true;
    };

    static ready = async () => {
        await this.view.ready();

        this.view.visible = true;
        RenderManager.update();
        this.view.visible = false;
    };
}

class PanelController {
    static init() {
        this.initViews();
        this.initPanel();
    }

    static initViews() {
        this.ui = new UI({ fps: true });
        this.ui.animateIn();
        Stage.add(this.ui);
    }

    static initPanel() {
        const { luminosityMaterial, bloomCompositeMaterial, compositeMaterial } = RenderManager;

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
                label: 'Blur',
                min: 0,
                max: 10,
                step: 0.1,
                value: RenderManager.blurFactor,
                callback: value => {
                    RenderManager.blurFactor = value;
                }
            },
            {
                type: 'slider',
                label: 'Opacity',
                min: 0,
                max: 1,
                step: 0.01,
                value: 1,
                callback: value => {
                    compositeMaterial.uniforms.uOpacity.value = value;
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

    /**
     * Public methods
     */

    static update = () => {
        if (!this.ui) {
            return;
        }

        this.ui.update();
    };
}

const BlurDirectionX = new Vector2(1, 0);
const BlurDirectionY = new Vector2(0, 1);

class RenderManager {
    static init(renderer, scene, camera, view, container) {
        this.renderer = renderer;
        this.scene = scene;
        this.camera = camera;
        this.views = view.children;
        this.container = container;
        this.sections = container.children;

        this.luminosityThreshold = 0.1;
        this.luminositySmoothing = 1;
        this.bloomStrength = 0.3;
        this.bloomRadius = 0.75;
        this.blurFactor = 10;
        this.enabled = true;
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

        // Gaussian blur materials
        this.hBlurMaterial = new BlurMaterial(BlurDirectionX);
        this.hBlurMaterial.uniforms.uBluriness.value = this.blurFactor;
        this.hBlurMaterial.uniforms.uResolution = resolution;

        this.vBlurMaterial = new BlurMaterial(BlurDirectionY);
        this.vBlurMaterial.uniforms.uBluriness.value = this.blurFactor;
        this.vBlurMaterial.uniforms.uResolution = resolution;

        // Composite materials
        this.sceneCompositeMaterial = new SceneCompositeMaterial();
        this.compositeMaterial = new CompositeMaterial();
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
        this.smooth = new Smooth({
            root: Stage,
            container: this.container,
            lerpSpeed: 0.075
        });
    }

    /**
     * Public methods
     */

    static setView = index => {
        this.next = index;

        const start = () => {
            const next = this.next;

            this.animateOut(() => {
                SceneController.setView(next);

                this.animateIn(() => {
                    this.index = next;

                    if (this.next !== this.index) {
                        start();
                    } else {
                        this.animatedIn = false;
                    }
                });
            });
        };

        if (!this.animatedIn) {
            this.animatedIn = true;

            start();
        }
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
        const renderer = this.renderer;
        const scene = this.scene;
        const camera = this.camera;

        if (!this.enabled) {
            renderer.setRenderTarget(null);
            renderer.render(scene, camera);
            return;
        }

        const screenScene = this.screenScene;
        const screenCamera = this.screenCamera;

        const renderTargetA = this.renderTargetA;
        const renderTargetB = this.renderTargetB;
        const renderTargetBright = this.renderTargetBright;
        const renderTargetsHorizontal = this.renderTargetsHorizontal;
        const renderTargetsVertical = this.renderTargetsVertical;

        // Scene pass
        renderer.setRenderTarget(renderTargetA);
        renderer.render(scene, camera);

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

        // Scene composite pass
        this.sceneCompositeMaterial.uniforms.tScene.value = renderTargetB.texture;
        this.sceneCompositeMaterial.uniforms.tBloom.value = renderTargetsHorizontal[0].texture;
        this.screen.material = this.sceneCompositeMaterial;
        renderer.setRenderTarget(renderTargetA);
        renderer.render(screenScene, screenCamera);

        // Two pass Gaussian blur (horizontal and vertical)
        const blurFactor = clamp(inverseLerp(0.5, 0, this.compositeMaterial.uniforms.uOpacity.value), 0, 1);

        if (blurFactor > 0) {
            this.hBlurMaterial.uniforms.tMap.value = renderTargetA.texture;
            this.hBlurMaterial.uniforms.uBluriness.value = this.blurFactor * blurFactor;
            this.screen.material = this.hBlurMaterial;
            renderer.setRenderTarget(renderTargetB);
            renderer.render(screenScene, screenCamera);

            this.vBlurMaterial.uniforms.tMap.value = renderTargetB.texture;
            this.vBlurMaterial.uniforms.uBluriness.value = this.blurFactor * blurFactor;
            this.screen.material = this.vBlurMaterial;
            renderer.setRenderTarget(renderTargetA);
            renderer.render(screenScene, screenCamera);
        }

        // Composite pass (render to screen)
        this.compositeMaterial.uniforms.tScene.value = renderTargetA.texture;
        this.screen.material = this.compositeMaterial;
        renderer.setRenderTarget(null);
        renderer.render(screenScene, screenCamera);
    };

    static animateOut = callback => {
        clearTween(this.compositeMaterial.uniforms.uOpacity);
        this.compositeMaterial.uniforms.uOpacity.value = 1;
        tween(this.compositeMaterial.uniforms.uOpacity, { value: 0 }, 300, 'linear', callback);
    };

    static animateIn = callback => {
        clearTween(this.compositeMaterial.uniforms.uOpacity);
        this.compositeMaterial.uniforms.uOpacity.value = 0;
        tween(this.compositeMaterial.uniforms.uOpacity, { value: 1 }, 300, 'linear', callback);
    };
}

class WorldController {
    static init() {
        this.initWorld();
        this.initLights();
        this.initLoaders();
        this.initEnvironment();

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

        // 3D scene
        this.scene = new Scene();
        this.scene.background = new Color(0x0e0e0e);
        this.camera = new PerspectiveCamera(30);
        this.camera.near = 0.5;
        this.camera.far = 40;
        this.camera.position.z = 8;
        this.camera.lookAt(-1.5, 0, -2);
        this.camera.zoom = 1.5;

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

    static initLights() {
        this.scene.add(new AmbientLight(0xffffff, 0.2));

        this.scene.add(new HemisphereLight(0x606060, 0x404040));

        const light = new DirectionalLight(0xffffff, 0.4);
        light.position.set(0.6, 0.5, 1);
        this.scene.add(light);
    }

    static initLoaders() {
        this.textureLoader = new TextureLoader();
        this.environmentLoader = new EnvironmentTextureLoader(this.renderer);
    }

    static async initEnvironment() {
        this.scene.environment = await this.loadEnvironmentTexture('assets/textures/env.jpg');
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

        if (width < Config.BREAKPOINT) {
            this.camera.lookAt(0, 0.5, -2);
            this.camera.zoom = 1;
        } else {
            this.camera.lookAt(-1.5, 0, -2);
            this.camera.zoom = 1.5;
        }

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
        WorldController.scene.add(this.view);

        this.container = new Container();
        Stage.add(this.container);
    }

    static initControllers() {
        const { renderer, scene, camera } = WorldController;

        SceneController.init(this.view);
        RenderManager.init(renderer, scene, camera, this.view, this.container);
    }

    static initPanel() {
        PanelController.init();
    }

    static async loadData() {
        const data = await Assets.loadData('transitions/data.json');

        data.pages.forEach((item, i) => {
            item.index = i;

            Global.SECTIONS.push(item);
        });
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
        PanelController.update();
    };

    /**
     * Public methods
     */

    static animateIn = () => {
        SceneController.animateIn();
        RenderManager.animateIn();

        Stage.tween({ opacity: 1 }, 1000, 'linear', () => {
            Stage.css({ opacity: '' });
        });
    };
}

App.init();
