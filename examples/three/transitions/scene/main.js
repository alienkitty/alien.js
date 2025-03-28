import { AssetLoader, BloomCompositeMaterial, BoxGeometry, Color, ColorManagement, Component, DirectionalLight, EnvironmentTextureLoader, GLSL3, Group, HemisphereLight, IcosahedronGeometry, ImageBitmapLoaderThread, Interface, LinearSRGBColorSpace, Link, LuminosityMaterial, MathUtils, Mesh, MeshStandardMaterial, NoBlending, OctahedronGeometry, OrthographicCamera, PanelItem, PerspectiveCamera, RawShaderMaterial, RepeatWrapping, Scene, SceneCompositeMaterial, Stage, TextureLoader, Title, UI, UnrealBloomBlurMaterial, Vector2, WebGLRenderTarget, WebGLRenderer, clearTween, delayedCall, getFullscreenTriangle, router, ticker, tween } from '../../../../build/alien.three.js';

const basePath = '/examples/three/transitions/scene';
const breakpoint = 1000;

class Page {
    constructor({ path, title }) {
        this.path = path;
        this.title = title;

        document.title = `${this.title} — Alien.js`;
    }
}

class Data {
    static init({ pages }) {
        this.pages = pages;
    }

    // Public methods

    static getNext = page => {
        let index = this.pages.indexOf(page);

        if (!~index || ++index > this.pages.length - 1) {
            index = 0;
        }

        return this.pages[index];
    };
}

class UIContainer extends Interface {
    constructor() {
        super('.container');

        this.init();
        this.initViews();

        this.addListeners();
        this.onResize();
    }

    init() {
        this.invisible();
        this.css({
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            height: '100%',
            padding: '55px 0'
        });
    }

    initViews() {
        const { data } = router.get(location.pathname);

        this.title = new Title(data.title.replace(/[\s.-]+/g, '_'));
        this.title.css({
            width: 'fit-content',
            pointerEvents: 'auto'
        });
        this.add(this.title);

        const next = Data.getNext(data);
        const path = router.getPath(next.path);

        this.link = new Link('Next', `${path}/`);
        this.link.css({ marginTop: 'auto' });
        this.add(this.link);
    }

    addListeners() {
        window.addEventListener('popstate', this.onPopState);
        window.addEventListener('resize', this.onResize);
        this.link.events.on('click', this.onClick);
    }

    // Event handlers

    onPopState = () => {
        const { data } = router.get(location.pathname);

        clearTween(this.timeout);

        this.timeout = delayedCall(300, () => {
            this.title.setTitle(data.title.replace(/[\s.-]+/g, '_'));
        });

        const next = Data.getNext(data);
        const path = router.getPath(next.path);

        this.link.setLink(`${path}/`);
    };

    onResize = () => {
        const width = document.documentElement.clientWidth;

        if (width < breakpoint) {
            this.css({
                padding: '24px 0'
            });
        } else {
            this.css({
                padding: '55px 0'
            });
        }
    };

    onClick = (e, { target }) => {
        e.preventDefault();

        router.setPath(target.link);
    };

    // Public methods

    animateIn = () => {
        this.visible();

        const duration = 2000;
        const stagger = 175;

        this.children.forEach((view, i) => {
            view.css({ opacity: 0 }).tween({ opacity: 1 }, duration, 'easeOutCubic', i * stagger);
        });

        this.title.animateIn();
        this.link.animateIn();
    };
}

class TransitionMaterial extends RawShaderMaterial {
    constructor() {
        super({
            glslVersion: GLSL3,
            uniforms: {
                tMap1: { value: null },
                tMap2: { value: null },
                uProgress: { value: 0 },
                uSize: { value: 0.04 },
                uZoom: { value: 50 },
                uColorSeparation: { value: 0.3 },
                uResolution: { value: new Vector2() },
                uTime: { value: 0 }
            },
            vertexShader: /* glsl */ `
                in vec3 position;
                in vec2 uv;

                out vec2 vUv;

                void main() {
                    vUv = uv;

                    gl_Position = vec4(position, 1.0);
                }
            `,
            fragmentShader: /* glsl */ `
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
            `,
            blending: NoBlending,
            depthTest: false,
            depthWrite: false
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
        this.scene.background = new Color(0x060606);

        // Render targets
        this.renderTarget = new WebGLRenderTarget(1, 1);
    }

    initLights() {
        this.scene.add(new HemisphereLight(0x606060, 0x404040, 3));

        const light = new DirectionalLight(0xffffff, 2);
        light.position.set(0.6, 0.5, 1);
        this.scene.add(light);
    }

    async initEnvironment() {
        const { loadEnvironmentTexture } = WorldController;

        this.scene.environment = await loadEnvironmentTexture('jewelry_black_contrast.jpg');
        this.scene.environmentIntensity = 1.2;
    }

    // Inheritable methods

    resize(width, height, dpr) {
        width = Math.round(width * dpr);
        height = Math.round(height * dpr);

        this.renderTarget.setSize(width, height);
    }

    update() {
        // Renderer state
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

        // Second set of UVs for aoMap and lightMap
        // https://threejs.org/docs/#api/en/materials/MeshStandardMaterial.aoMap
        geometry.attributes.uv1 = geometry.attributes.uv;

        // Textures
        const [map, normalMap, ormMap] = await Promise.all([
            // loadTexture('uv.jpg'),
            loadTexture('pbr/pitted_metal_basecolor.jpg'),
            loadTexture('pbr/pitted_metal_normal.jpg'),
            // https://occlusion-roughness-metalness.glitch.me/
            loadTexture('pbr/pitted_metal_orm.jpg')
        ]);

        map.anisotropy = anisotropy;
        normalMap.anisotropy = anisotropy;
        ormMap.anisotropy = anisotropy;

        const material = new MeshStandardMaterial({
            color: new Color().offsetHSL(0, 0, -0.65),
            metalness: 0.7,
            roughness: 0.7,
            map,
            metalnessMap: ormMap,
            roughnessMap: ormMap,
            aoMap: ormMap,
            aoMapIntensity: 1,
            normalMap,
            normalScale: new Vector2(1, 1),
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

    // Public methods

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

    // Public methods

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

        // Prerender
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

        // Second set of UVs for aoMap and lightMap
        // https://threejs.org/docs/#api/en/materials/MeshStandardMaterial.aoMap
        geometry.attributes.uv1 = geometry.attributes.uv;

        // Textures
        const [map, normalMap, ormMap] = await Promise.all([
            // loadTexture('uv.jpg'),
            loadTexture('pbr/pitted_metal_basecolor.jpg'),
            loadTexture('pbr/pitted_metal_normal.jpg'),
            // https://occlusion-roughness-metalness.glitch.me/
            loadTexture('pbr/pitted_metal_orm.jpg')
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
            metalness: 0.7,
            roughness: 0.7,
            map,
            metalnessMap: ormMap,
            roughnessMap: ormMap,
            aoMap: ormMap,
            aoMapIntensity: 1,
            normalMap,
            normalScale: new Vector2(1, 1),
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

    // Public methods

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

    // Public methods

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

        // Prerender
        this.scene.visible = true;
        super.update();
        this.scene.visible = false;
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
            // loadTexture('uv.jpg'),
            loadTexture('pbr/pitted_metal_basecolor.jpg'),
            loadTexture('pbr/pitted_metal_normal.jpg'),
            // https://occlusion-roughness-metalness.glitch.me/
            loadTexture('pbr/pitted_metal_orm.jpg')
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
            metalness: 0.7,
            roughness: 2,
            map,
            metalnessMap: ormMap,
            roughnessMap: ormMap,
            aoMap: ormMap,
            aoMapIntensity: 1,
            normalMap,
            normalScale: new Vector2(3, 3)
        });

        // Second channel for aoMap and lightMap
        // https://threejs.org/docs/#api/en/materials/MeshStandardMaterial.aoMap
        material.aoMap.channel = 1;

        const mesh = new Mesh(geometry, material);
        this.add(mesh);

        this.mesh = mesh;
    }

    // Public methods

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

    // Public methods

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

        // Prerender
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

    // Public methods

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

    static addListeners() {
        window.addEventListener('popstate', this.onPopState);
    }

    // Event handlers

    static onPopState = () => {
        const { data } = router.get(location.pathname);

        let view;

        switch (data.path) {
            case '/dark_planet':
                view = this.view.darkPlanet;
                break;
            case '/floating_crystal':
                view = this.view.floatingCrystal;
                break;
            case '/abstract_cube':
                view = this.view.abstractCube;
                break;
        }

        RenderManager.setView(view);
    };

    // Public methods

    static resize = (width, height, dpr) => {
        this.view.resize(width, height, dpr);
    };

    static update = time => {
        this.view.update(time);
    };

    static animateIn = () => {
        this.addListeners();
        this.onPopState();
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
                name: 'FPS'
            },
            {
                type: 'divider'
            },
            {
                type: 'slider',
                name: 'Thresh',
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
                name: 'Smooth',
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
                name: 'Strength',
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
                name: 'Radius',
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
                name: 'Size',
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
                name: 'Zoom',
                min: 0,
                max: 100,
                step: 0.1,
                value: transitionMaterial.uniforms.uZoom.value,
                callback: value => {
                    transitionMaterial.uniforms.uZoom.value = value;
                }
            },
            {
                type: 'slider',
                name: 'Chroma',
                min: 0,
                max: 10,
                step: 0.1,
                value: transitionMaterial.uniforms.uColorSeparation.value,
                callback: value => {
                    transitionMaterial.uniforms.uColorSeparation.value = value;
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
    static init(renderer) {
        this.renderer = renderer;

        // Unreal bloom
        this.luminosityThreshold = 0.1;
        this.luminositySmoothing = 1;
        this.bloomStrength = 0.3;
        this.bloomRadius = 0.2;

        this.animatedIn = false;

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

        this.renderTargetBright = this.renderTarget.clone();
        this.renderTargetsHorizontal = [];
        this.renderTargetsVertical = [];
        this.nMips = 5;

        for (let i = 0, l = this.nMips; i < l; i++) {
            this.renderTargetsHorizontal.push(this.renderTarget.clone());
            this.renderTargetsVertical.push(this.renderTarget.clone());
        }

        this.renderTarget.depthBuffer = true;

        // Transition material
        this.transitionMaterial = new TransitionMaterial();

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

        // Unreal bloom composite material
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

    // Public methods

    static setView = view => {
        if (this.view) {
            this.next = view;

            const start = () => {
                const next = this.next;
                next.scene.visible = true;

                this.transitionMaterial.uniforms.tMap2.value = next.renderTarget.texture;
                tween(this.transitionMaterial.uniforms.uProgress, { value: 1 }, 1500, 'easeInOutCubic', () => {
                    this.transitionMaterial.uniforms.tMap1.value = next.renderTarget.texture;
                    this.transitionMaterial.uniforms.uProgress.value = 0;
                    this.view.scene.visible = false;
                    this.view = next;

                    if (this.next !== this.view) {
                        start();
                    } else {
                        this.animatedIn = false;
                    }
                });
            };

            if (!this.animatedIn) {
                this.animatedIn = true;

                start();
            }
        } else {
            // First view
            view.scene.visible = true;
            this.transitionMaterial.uniforms.tMap1.value = view.renderTarget.texture;
            this.view = view;
        }
    };

    static resize = (width, height, dpr) => {
        this.renderer.setPixelRatio(dpr);
        this.renderer.setSize(width, height);

        width = Math.round(width * dpr);
        height = Math.round(height * dpr);

        this.renderTarget.setSize(width, height);

        // Unreal bloom
        width = Math.round(width / 2);
        height = Math.round(height / 2);

        this.renderTargetBright.setSize(width, height);

        for (let i = 0, l = this.nMips; i < l; i++) {
            this.renderTargetsHorizontal[i].setSize(width, height);
            this.renderTargetsVertical[i].setSize(width, height);

            this.blurMaterials[i].uniforms.uResolution.value.set(width, height);

            width = Math.round(width / 2);
            height = Math.round(height / 2);
        }
    };

    static update = () => {
        const renderer = this.renderer;

        const renderTarget = this.renderTarget;
        const renderTargetBright = this.renderTargetBright;
        const renderTargetsHorizontal = this.renderTargetsHorizontal;
        const renderTargetsVertical = this.renderTargetsVertical;

        // Scene composite pass
        this.screen.material = this.transitionMaterial;
        renderer.setRenderTarget(renderTarget);
        renderer.render(this.screen, this.screenCamera);

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
        this.initLoaders();

        this.addListeners();
    }

    static initWorld() {
        this.renderer = new WebGLRenderer({
            powerPreference: 'high-performance',
            antialias: true
        });

        // Output canvas
        this.element = this.renderer.domElement;

        // Disable color management
        ColorManagement.enabled = false;
        this.renderer.outputColorSpace = LinearSRGBColorSpace;

        // Global 3D camera
        this.camera = new PerspectiveCamera(30);
        this.camera.near = 0.5;
        this.camera.far = 40;
        this.camera.position.z = 8;

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

    static initLoaders() {
        this.textureLoader = new TextureLoader();
        this.textureLoader.setPath('/examples/assets/textures/');

        this.environmentLoader = new EnvironmentTextureLoader(this.renderer);
        this.environmentLoader.setPath('/examples/assets/textures/env/');
    }

    static addListeners() {
        this.renderer.domElement.addEventListener('touchstart', this.onTouchStart);
    }

    // Event handlers

    static onTouchStart = e => {
        e.preventDefault();
    };

    // Public methods

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

    static ready = () => Promise.all([
        this.textureLoader.ready(),
        this.environmentLoader.ready()
    ]);

    // Global handlers

    static getTexture = (path, callback) => this.textureLoader.load(path, callback);

    static loadTexture = path => this.textureLoader.loadAsync(path);

    static loadEnvironmentTexture = path => this.environmentLoader.loadAsync(path);
}

class App {
    static async init() {
        this.initThread();
        this.initLoader();
        this.initStage();
        this.initWorld();

        await this.loadData();

        this.initRouter();
        this.initViews();
        this.initControllers();

        this.addListeners();
        this.onResize();

        await SceneController.ready();
        await WorldController.ready();

        this.initPanel();

        this.animateIn();
    }

    static initThread() {
        ImageBitmapLoaderThread.init();
    }

    static initLoader() {
        this.assetLoader = new AssetLoader();
        this.assetLoader.setPath('/examples/three/transitions/');
    }

    static initStage() {
        Stage.init();
        Stage.css({ opacity: 0 });
    }

    static initWorld() {
        WorldController.init();
        Stage.add(WorldController.element);
    }

    static async loadData() {
        const data = await this.assetLoader.loadData('data.json');

        Data.init(data);
    }

    static initRouter() {
        Data.pages.forEach(page => {
            router.add(page.path, Page, page);
        });

        // Landing and 404 page
        const home = Data.pages[0]; // Dark Planet

        router.add('/', Page, home);
        router.add('404', Page, home);

        router.init({
            path: basePath,
            scrollRestoration: 'auto'
        });
    }

    static initViews() {
        this.view = new SceneView();

        this.ui = new UI({ fps: true, breakpoint });
        this.ui.container = new UIContainer();
        this.ui.add(this.ui.container);
        Stage.add(this.ui);
    }

    static initControllers() {
        const { renderer } = WorldController;

        SceneController.init(this.view);
        RenderManager.init(renderer);
    }

    static initPanel() {
        PanelController.init(this.ui);
    }

    static addListeners() {
        window.addEventListener('resize', this.onResize);
        ticker.add(this.onUpdate);
    }

    // Event handlers

    static onResize = () => {
        const width = document.documentElement.clientWidth;
        const height = document.documentElement.clientHeight;
        const dpr = window.devicePixelRatio;

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

    // Public methods

    static animateIn = () => {
        SceneController.animateIn();
        this.ui.animateIn();
        this.ui.container.animateIn();

        Stage.tween({ opacity: 1 }, 1000, 'linear', () => {
            Stage.css({ opacity: '' });
        });
    };
}

App.init();
