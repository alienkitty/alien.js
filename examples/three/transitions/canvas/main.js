import { ACESFilmicToneMapping, AmbientLight, AssetLoader, BloomCompositeMaterial, BoxGeometry, Color, ColorManagement, DirectionalLight, EnvironmentTextureLoader, Group, Header, HemisphereLight, IcosahedronGeometry, ImageBitmapLoaderThread, Interface, LinearSRGBColorSpace, LuminosityMaterial, MathUtils, Mesh, MeshStandardMaterial, OctahedronGeometry, OrthographicCamera, PanelItem, PerspectiveCamera, RepeatWrapping, Scene, SceneCompositeMaterial, Stage, TextureLoader, Thread, UnrealBloomBlurMaterial, Vector2, WebGLRenderTarget, WebGLRenderer, clearTween, getFullscreenTriangle, shuffle, ticker, tween } from '../../../../build/alien.three.js';

ColorManagement.enabled = false; // Disable color management

class Global {
    static PAGES = [];
    static PAGE_INDEX = 0;
}

class Config {
    static PATH = '/examples/three/';
    static BREAKPOINT = 1000;
}

class Page {
    constructor({ path, title }) {
        this.path = path;
        this.title = title;
        this.pageTitle = `${this.title} — Alien.js`;
    }
}

class Data {
    static path = `${Config.PATH}transitions/canvas/`;

    static init() {
        this.setIndexes();

        this.addListeners();
        this.onStateChange();
    }

    static setIndexes() {
        Global.PAGES.forEach((item, i) => item.index = i);
    }

    static addListeners() {
        Stage.events.on('state_change', this.onStateChange);
    }

    /**
     * Event handlers
     */

    static onStateChange = () => {
        const { path } = Stage;

        const item = this.getPage(path);

        if (item) {
            Global.PAGE_INDEX = item.index;
        } else {
            Global.PAGE_INDEX = 0;
        }
    };

    /**
     * Public methods
     */

    static getPath = path => {
        return this.path + path;
    };

    static getPage = path => {
        return Global.PAGES.find(item => path.includes(item.path));
    };

    static setPage = path => {
        const item = this.getPage(path);

        if (item && item.index !== Global.PAGE_INDEX) {
            Global.PAGE_INDEX = item.index;

            Stage.setPath(path);
            Stage.setTitle(item.pageTitle);
        }
    };

    static getNext = () => {
        let index = Global.PAGE_INDEX + 1;

        if (index > Global.PAGES.length - 1) {
            index = 0;
        }

        return Global.PAGES[index];
    };
}

class UILink extends Interface {
    constructor(title, link) {
        super('.link', 'a');

        this.title = title;
        this.link = link;

        this.initHTML();

        this.addListeners();
    }

    initHTML() {
        this.invisible();
        this.css({
            position: 'relative',
            padding: 10,
            fontFamily: 'Gothic A1, sans-serif',
            fontWeight: '400',
            fontSize: 13,
            lineHeight: '1.4',
            letterSpacing: '0.03em',
            textTransform: 'uppercase',
            textDecoration: 'none',
            pointerEvents: 'none',
            opacity: 0
        });
        this.attr({ href: this.link });
        this.text(this.title);

        this.line = new Interface('.line');
        this.line.css({
            position: 'absolute',
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

        Data.setPage(this.link);
    };

    /**
     * Public methods
     */

    setLink = link => {
        this.link = link;

        this.attr({ href: this.link });
    };

    animateIn = () => {
        this.visible();
        this.css({ pointerEvents: 'auto' });

        this.clearTween().tween({ opacity: 1 }, 1000, 'easeOutSine');
    };

    animateOut = () => {
        this.css({ pointerEvents: 'none' });

        this.clearTween().tween({ opacity: 0 }, 300, 'easeInSine', () => {
            this.invisible();
            this.onHover({ type: 'mouseleave' });
        });
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
            letter.css({ display: 'inline-block' });
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

class UIBackground extends Interface {
    constructor() {
        super(null, 'canvas');

        this.progress = 0;
        this.bend = 0;
        this.animatedIn = false;
        this.needsUpdate = false;

        this.initHTML();
        this.initCanvas();
        this.initFill();
        this.initPoints();
    }

    initHTML() {
        this.css({
            position: 'absolute',
            left: 0,
            top: 0,
            width: '100%',
            height: '100%',
            pointerEvents: 'none'
        });
    }

    initCanvas() {
        this.context = this.element.getContext('2d');
    }

    initFill() {
        this.fill = {};
        this.fill.fillStyle = '#000';
    }

    initPoints() {
        this.points = [];

        for (let i = 0; i < 3; i++) {
            this.points.push(new Vector2());
        }
    }

    drawFill() {
        this.context.fillStyle = this.fill.fillStyle;

        // Spline
        this.context.beginPath();
        this.context.moveTo(this.points[0].x, this.points[0].y);
        this.context.quadraticCurveTo(this.points[1].x, this.points[1].y, this.points[2].x, this.points[2].y);

        // Fill
        if (this.animatedIn) {
            this.context.lineTo(this.width, 0);
            this.context.lineTo(0, 0);
        } else {
            this.context.lineTo(this.width, this.start);
            this.context.lineTo(0, this.start);
        }

        this.context.lineTo(this.points[0].x, this.points[0].y);
        this.context.fill();
    }

    /**
     * Public methods
     */

    resize = (width, height, dpr) => {
        this.width = width;
        this.height = height;

        this.start = height;
        this.end = 0;
        this.direction = this.end - this.start < 0 ? -1 : 1;

        this.element.width = Math.round(this.width * dpr);
        this.element.height = Math.round(this.height * dpr);
        this.element.style.width = this.width + 'px';
        this.element.style.height = this.height + 'px';
        this.context.scale(dpr, dpr);

        const increment = width / (this.points.length - 1);

        for (let i = 0, l = this.points.length; i < l; i++) {
            this.points[i].x = increment * i;
            this.points[i].y = this.start;
        }
    };

    update = () => {
        if (this.needsUpdate) {
            for (let i = 0, l = this.points.length; i < l; i++) {
                const difference = Math.abs(this.width / 2 - this.points[i].x) / this.width;
                const offset = (this.bend - (difference * (this.height / 2)) * this.bend) * this.direction;
                this.points[i].y = this.start + offset + this.height * this.progress * this.direction;
            }

            this.context.clearRect(0, 0, this.element.width, this.element.height);

            this.drawFill();
        }
    };

    animateIn = callback => {
        clearTween(this);

        this.progress = 0;
        this.bend = 0;
        this.animatedIn = false;
        this.needsUpdate = true;

        tween(this, { progress: 1 }, 1250, 'easeInOutQuart', () => {
            this.needsUpdate = false;

            if (callback) {
                callback();
            }
        });

        tween(this, { bend: 1 }, 500, 'linear', () => {
            tween(this, { bend: 0 }, 500, 'linear');
        });
    };

    animateOut = callback => {
        clearTween(this);

        this.progress = 0;
        this.bend = 0;
        this.animatedIn = true;
        this.needsUpdate = true;

        tween(this, { progress: 1 }, 1250, 'easeInOutQuart', () => {
            this.needsUpdate = false;
            this.animatedIn = false;

            if (callback) {
                callback();
            }
        });

        tween(this, { bend: 1 }, 500, 'linear', () => {
            tween(this, { bend: 0 }, 500, 'linear');
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
            pointerEvents: 'none',
            opacity: 0
        });

        this.container = new Interface('.container');
        this.container.css({
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            height: '100%',
            padding: '24px 0'
        });
        this.add(this.container);
    }

    initViews() {
        this.background = new UIBackground();
        this.add(this.background);

        this.header = new Header();
        this.add(this.header);

        this.title = new UITitle(Global.PAGES[Global.PAGE_INDEX].title);
        this.container.add(this.title);

        const item = Data.getNext();
        const link = Data.getPath(item.path);

        this.link = new UILink('Next', link);
        this.link.css({ marginTop: 'auto' });
        this.container.add(this.link);
    }

    addListeners() {
        Stage.events.on('state_change', this.onStateChange);
        window.addEventListener('resize', this.onResize);
    }

    /**
     * Event handlers
     */

    onStateChange = () => {
        this.title.animateOut();
        this.link.animateOut();

        this.background.animateIn(() => {
            SceneController.setView();

            this.title.setTitle(Global.PAGES[Global.PAGE_INDEX].title);

            this.background.animateOut(() => {
                const item = Data.getNext();
                const link = Data.getPath(item.path);

                this.link.setLink(link);
                this.link.animateIn();
            });
        });
    };

    onResize = () => {
        if (document.documentElement.clientWidth < Config.BREAKPOINT) {
            this.container.css({
                padding: '24px 0'
            });
        } else {
            this.container.css({
                padding: '55px 0'
            });
        }
    };

    /**
     * Public methods
     */

    addPanel = item => {
        this.header.info.panel.add(item);
    };

    resize = (width, height, dpr) => {
        this.background.resize(width, height, dpr);
    };

    update = () => {
        this.background.update();
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
        this.title.animateIn();
        this.link.animateIn();
    };
}

class AbstractCube extends Group {
    constructor() {
        super();
    }

    async initMesh() {
        const { anisotropy, loadTexture } = WorldController;

        const geometry = new BoxGeometry();

        // Second set of UVs for aoMap and lightMap
        // https://threejs.org/docs/#api/en/materials/MeshStandardMaterial.aoMap
        geometry.attributes.uv1 = geometry.attributes.uv;

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
            metalness: 0.6,
            roughness: 0.7,
            map,
            metalnessMap: ormMap,
            roughnessMap: ormMap,
            aoMap: ormMap,
            aoMapIntensity: 1,
            normalMap,
            normalScale: new Vector2(1, 1),
            envMapIntensity: 1,
            flatShading: true
        });

        // Second channel for aoMap and lightMap
        // https://threejs.org/docs/#api/en/materials/MeshStandardMaterial.aoMap
        material.aoMap.channel = 1;

        const mesh = new Mesh(geometry, material);
        mesh.rotation.x = MathUtils.degToRad(-45);
        mesh.rotation.z = MathUtils.degToRad(-45);
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

        // Second set of UVs for aoMap and lightMap
        // https://threejs.org/docs/#api/en/materials/MeshStandardMaterial.aoMap
        geometry.attributes.uv1 = geometry.attributes.uv;

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
        map.repeat.set(2, 2);

        normalMap.anisotropy = anisotropy;
        normalMap.wrapS = RepeatWrapping;
        normalMap.wrapT = RepeatWrapping;
        normalMap.repeat.set(2, 2);

        ormMap.anisotropy = anisotropy;
        ormMap.wrapS = RepeatWrapping;
        ormMap.wrapT = RepeatWrapping;
        ormMap.repeat.set(2, 2);

        const material = new MeshStandardMaterial({
            color: new Color().offsetHSL(0, 0, -0.65),
            metalness: 0.6,
            roughness: 0.7,
            map,
            metalnessMap: ormMap,
            roughnessMap: ormMap,
            aoMap: ormMap,
            aoMapIntensity: 1,
            normalMap,
            normalScale: new Vector2(1, 1),
            envMapIntensity: 1,
            flatShading: true
        });

        // Second channel for aoMap and lightMap
        // https://threejs.org/docs/#api/en/materials/MeshStandardMaterial.aoMap
        material.aoMap.channel = 1;

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
        this.rotation.z = MathUtils.degToRad(25);
    }

    async initMesh() {
        const { anisotropy, loadTexture } = WorldController;

        const geometry = new IcosahedronGeometry(0.6, 12);

        // Second set of UVs for aoMap and lightMap
        // https://threejs.org/docs/#api/en/materials/MeshStandardMaterial.aoMap
        geometry.attributes.uv1 = geometry.attributes.uv;

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
            metalness: 0.6,
            roughness: 2,
            map,
            metalnessMap: ormMap,
            roughnessMap: ormMap,
            aoMap: ormMap,
            aoMapIntensity: 1,
            normalMap,
            normalScale: new Vector2(3, 3),
            envMapIntensity: 1
        });

        // Second channel for aoMap and lightMap
        // https://threejs.org/docs/#api/en/materials/MeshStandardMaterial.aoMap
        material.aoMap.channel = 1;

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
    }

    /**
     * Public methods
     */

    static setView = () => {
        this.view.darkPlanet.visible = false;
        this.view.floatingCrystal.visible = false;
        this.view.abstractCube.visible = false;

        switch (Global.PAGE_INDEX) {
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
        this.setView();

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
    static init(ui) {
        this.ui = ui;

        this.initPanel();
    }

    static initPanel() {
        const { luminosityMaterial, bloomCompositeMaterial } = RenderManager;

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
                value: luminosityMaterial.uniforms.uThreshold.value,
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
                value: luminosityMaterial.uniforms.uSmoothing.value,
                callback: value => {
                    luminosityMaterial.uniforms.uSmoothing.value = value;
                }
            },
            {
                type: 'slider',
                label: 'Strength',
                min: 0,
                max: 2,
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
                type: 'color',
                value: this.ui.background.fill.fillStyle,
                callback: value => {
                    this.ui.background.fill.fillStyle = `#${value.getHexString()}`;
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
    static init(renderer, scene, camera) {
        this.renderer = renderer;
        this.scene = scene;
        this.camera = camera;

        this.luminosityThreshold = 0.1;
        this.luminositySmoothing = 1;
        this.bloomStrength = 0.3;
        this.bloomRadius = 0.2;
        this.enabled = true;

        this.initRenderer();
    }

    static initRenderer() {
        const { screenTriangle } = WorldController;

        // Fullscreen triangle
        this.screenCamera = new OrthographicCamera(-1, 1, 1, -1, 0, 1);
        this.screen = new Mesh(screenTriangle);
        this.screen.frustumCulled = false;

        // Render targets
        this.renderTarget = new WebGLRenderTarget(1, 1, {
            depthBuffer: false
        });

        this.renderTargetsHorizontal = [];
        this.renderTargetsVertical = [];
        this.nMips = 5;

        this.renderTargetBright = this.renderTarget.clone();

        for (let i = 0, l = this.nMips; i < l; i++) {
            this.renderTargetsHorizontal.push(this.renderTarget.clone());
            this.renderTargetsVertical.push(this.renderTarget.clone());
        }

        this.renderTarget.depthBuffer = true;

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
            bloomFactors[i] = this.bloomStrength * MathUtils.lerp(factor, 1.2 - factor, this.bloomRadius);
        }

        return bloomFactors;
    }

    /**
     * Public methods
     */

    static resize = (width, height, dpr) => {
        this.renderer.setPixelRatio(dpr);
        this.renderer.setSize(width, height);

        width = Math.round(width * dpr);
        height = Math.round(height * dpr);

        this.renderTarget.setSize(width, height);

        width = MathUtils.floorPowerOfTwo(width) / 2;
        height = MathUtils.floorPowerOfTwo(height) / 2;

        this.renderTargetBright.setSize(width, height);

        for (let i = 0, l = this.nMips; i < l; i++) {
            this.renderTargetsHorizontal[i].setSize(width, height);
            this.renderTargetsVertical[i].setSize(width, height);

            this.blurMaterials[i].uniforms.uResolution.value.set(width, height);

            width /= 2;
            height /= 2;
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

        const renderTarget = this.renderTarget;
        const renderTargetBright = this.renderTargetBright;
        const renderTargetsHorizontal = this.renderTargetsHorizontal;
        const renderTargetsVertical = this.renderTargetsVertical;

        // Scene pass
        renderer.setRenderTarget(renderTarget);
        renderer.render(scene, camera);

        // Extract bright areas
        this.luminosityMaterial.uniforms.tMap.value = renderTarget.texture;
        this.screen.material = this.luminosityMaterial;
        renderer.setRenderTarget(renderTargetBright);
        renderer.render(this.screen, this.screenCamera);

        // Blur all the mips progressively
        let inputRenderTarget = renderTargetBright;

        for (let i = 0, l = this.nMips; i < l; i++) {
            this.screen.material = this.blurMaterials[i];

            this.blurMaterials[i].uniforms.tMap.value = inputRenderTarget.texture;
            this.blurMaterials[i].uniforms.uDirection.value = BlurDirectionX;
            renderer.setRenderTarget(renderTargetsHorizontal[i]);
            renderer.render(this.screen, this.screenCamera);

            this.blurMaterials[i].uniforms.tMap.value = this.renderTargetsHorizontal[i].texture;
            this.blurMaterials[i].uniforms.uDirection.value = BlurDirectionY;
            renderer.setRenderTarget(renderTargetsVertical[i]);
            renderer.render(this.screen, this.screenCamera);

            inputRenderTarget = renderTargetsVertical[i];
        }

        // Composite all the mips
        this.screen.material = this.bloomCompositeMaterial;
        renderer.setRenderTarget(renderTargetsHorizontal[0]);
        renderer.render(this.screen, this.screenCamera);

        // Composite pass (render to screen)
        this.compositeMaterial.uniforms.tScene.value = renderTarget.texture;
        this.compositeMaterial.uniforms.tBloom.value = renderTargetsHorizontal[0].texture;
        this.screen.material = this.compositeMaterial;
        renderer.setRenderTarget(null);
        renderer.render(this.screen, this.screenCamera);
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
            stencil: false,
            antialias: true
        });
        this.element = this.renderer.domElement;

        // Tone mapping and output color space encoding
        this.renderer.toneMapping = ACESFilmicToneMapping;
        this.renderer.toneMappingExposure = 1;
        this.renderer.outputColorSpace = LinearSRGBColorSpace;

        // 3D scene
        this.scene = new Scene();
        this.scene.background = new Color(0x0e0e0e);
        this.camera = new PerspectiveCamera(30);
        this.camera.near = 0.5;
        this.camera.far = 40;
        this.camera.position.z = 8;
        this.camera.lookAt(this.scene.position);

        // Global geometries
        this.screenTriangle = getFullscreenTriangle();

        // Global uniforms
        this.resolution = { value: new Vector2() };
        this.texelSize = { value: new Vector2() };
        this.aspect = { value: 1 };
        this.time = { value: 0 };
        this.frame = { value: 0 };

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
        this.textureLoader.setPath(Config.PATH);

        this.environmentLoader = new EnvironmentTextureLoader(this.renderer);
        this.environmentLoader.setPath(Config.PATH);
    }

    static async initEnvironment() {
        this.scene.environment = await this.loadEnvironmentTexture('assets/textures/env/jewelry_black_contrast.jpg');
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
        this.texelSize.value.set(1 / width, 1 / height);
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
        if (!/firefox/i.test(navigator.userAgent)) {
            this.initThread();
        }

        this.initLoader();
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

    static initLoader() {
        this.assetLoader = new AssetLoader();
        this.assetLoader.setPath(Config.PATH);
    }

    static initStage() {
        Stage.init();
        Stage.css({ opacity: 0 });
    }

    static initWorld() {
        WorldController.init();
        Stage.add(WorldController.element);
    }

    static initViews() {
        this.view = new SceneView();
        WorldController.scene.add(this.view);

        this.ui = new UI();
        Stage.add(this.ui);
    }

    static initControllers() {
        const { renderer, scene, camera } = WorldController;

        SceneController.init(this.view);
        RenderManager.init(renderer, scene, camera);
    }

    static initPanel() {
        PanelController.init(this.ui);
    }

    static async loadData() {
        const data = await this.assetLoader.loadData('transitions/data.json');

        data.pages.forEach(item => {
            Global.PAGES.push(new Page(item));
        });

        Data.init();

        const item = Data.getPage(Stage.path);

        if (item && item.path) {
            const path = Data.getPath(item.path);

            Data.setPage(path);
        }
    }

    static addListeners() {
        window.addEventListener('resize', this.onResize);
        ticker.add(this.onUpdate);
    }

    /**
     * Event handlers
     */

    static onResize = () => {
        const width = document.documentElement.clientWidth;
        const height = document.documentElement.clientHeight;
        const dpr = window.devicePixelRatio;

        WorldController.resize(width, height, dpr);
        SceneController.resize();
        RenderManager.resize(width, height, dpr);
        this.ui.resize(width, height, dpr);
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
        this.ui.animateIn();

        Stage.tween({ opacity: 1 }, 1000, 'linear', () => {
            Stage.css({ opacity: '' });
        });
    };
}

App.init();
