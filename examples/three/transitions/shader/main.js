import { AssetLoader, BloomCompositeMaterial, BoxGeometry, Color, ColorManagement, DirectionalLight, EnvironmentTextureLoader, GLSL3, Group, HemisphereLight, IcosahedronGeometry, ImageBitmapLoaderThread, Interface, LinearSRGBColorSpace, Link, LuminosityMaterial, MathUtils, Mesh, MeshStandardMaterial, OctahedronGeometry, OrthographicCamera, PanelItem, PerspectiveCamera, RawShaderMaterial, RepeatWrapping, Router, Scene, SceneCompositeMaterial, Stage, TextureLoader, Thread, Title, UI, UnrealBloomBlurMaterial, Vector2, WebGLRenderTarget, WebGLRenderer, clearTween, delayedCall, getFullscreenTriangle, ticker, tween } from '../../../../build/alien.three.js';

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
            padding: '55px 0',
            pointerEvents: 'none',
            opacity: 0
        });
    }

    initViews() {
        const { data } = Router.get(location.pathname);

        this.title = new Title(data.title.replace(/[\s.]+/g, '_'));
        this.add(this.title);

        const next = Data.getNext(data);
        const path = Router.getPath(next.path);

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
        const { data } = Router.get(location.pathname);

        this.title.animateOut();
        this.link.animateOut();

        clearTween(this.timeout);

        RenderManager.animateOut(() => {
            SceneController.setView();

            this.timeout = delayedCall(950, () => {
                this.title.setTitle(data.title.replace(/[\s.]+/g, '_'));
            });

            RenderManager.animateIn(() => {
                const next = Data.getNext(data);
                const path = Router.getPath(next.path);

                this.link.setLink(`${path}/`);
                this.link.animateIn();
            });
        });
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

        Router.setPath(target.link);
    };

    // Public methods

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

        this.title.animateIn();
        this.link.animateIn();
    };
}

// Based on https://codepen.io/ReGGae/pen/rNxpVEd

class TransitionMaterial extends RawShaderMaterial {
    constructor({
        color
    } = {}) {
        super({
            glslVersion: GLSL3,
            uniforms: {
                uColor: { value: color instanceof Color ? color : new Color(color) },
                uProgress: { value: 0 },
                uPower: { value: 0 },
                uOut: { value: true }
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

                #define PI 3.1415926535897932384626433832795

                uniform vec3 uColor;
                uniform float uProgress;
                uniform float uPower;
                uniform bool uOut;

                in vec2 vUv;

                out vec4 FragColor;

                void main() {
                    vec2 uv = vUv;

                    uv.y -= (sin(uv.x * PI) * uPower) * 0.1;

                    if (!uOut) {
                        uv.y = 1.0 - uv.y;
                    }

                    float t = smoothstep(uv.y - fwidth(uv.y), uv.y, uProgress);

                    FragColor = mix(vec4(0), vec4(uColor, 1.0), t);
                }
            `,
            transparent: true,
            depthTest: false,
            depthWrite: false
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

    // Public methods

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

    // Public methods

    static setView = () => {
        const { data } = Router.get(location.pathname);

        this.view.darkPlanet.visible = false;
        this.view.floatingCrystal.visible = false;
        this.view.abstractCube.visible = false;

        switch (data.path) {
            case '/dark_planet':
                this.view.darkPlanet.visible = true;
                break;
            case '/floating_crystal':
                this.view.floatingCrystal.visible = true;
                break;
            case '/abstract_cube':
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

        // Prerender
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
                type: 'color',
                value: transitionMaterial.uniforms.uColor.value,
                callback: value => {
                    transitionMaterial.uniforms.uColor.value.copy(value);
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

        // Bloom
        this.luminosityThreshold = 0.1;
        this.luminositySmoothing = 1;
        this.bloomStrength = 0.3;
        this.bloomRadius = 0.2;

        this.enabled = true;

        this.initRenderer();
    }

    static initRenderer() {
        const { screenTriangle } = WorldController;

        // Manually clear
        this.renderer.autoClear = false;

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

        // Transition material
        this.transitionMaterial = new TransitionMaterial({
            color: 0x000000
        });
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

    static resize = (width, height, dpr) => {
        this.renderer.setPixelRatio(dpr);
        this.renderer.setSize(width, height);

        width = Math.round(width * dpr);
        height = Math.round(height * dpr);

        this.renderTarget.setSize(width, height);

        // Unreal bloom
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
            renderer.clear();
            renderer.render(scene, camera);
            return;
        }

        const renderTarget = this.renderTarget;
        const renderTargetBright = this.renderTargetBright;
        const renderTargetsHorizontal = this.renderTargetsHorizontal;
        const renderTargetsVertical = this.renderTargetsVertical;

        // Scene pass
        renderer.setRenderTarget(renderTarget);
        renderer.clear();
        renderer.render(scene, camera);

        // Extract bright areas
        this.luminosityMaterial.uniforms.tMap.value = renderTarget.texture;
        this.screen.material = this.luminosityMaterial;
        renderer.setRenderTarget(renderTargetBright);
        renderer.clear();
        renderer.render(this.screen, this.screenCamera);

        // Blur all the mips progressively
        let inputRenderTarget = renderTargetBright;

        for (let i = 0, l = this.nMips; i < l; i++) {
            this.screen.material = this.blurMaterials[i];

            this.blurMaterials[i].uniforms.tMap.value = inputRenderTarget.texture;
            this.blurMaterials[i].uniforms.uDirection.value = BlurDirectionX;
            renderer.setRenderTarget(renderTargetsHorizontal[i]);
            renderer.clear();
            renderer.render(this.screen, this.screenCamera);

            this.blurMaterials[i].uniforms.tMap.value = this.renderTargetsHorizontal[i].texture;
            this.blurMaterials[i].uniforms.uDirection.value = BlurDirectionY;
            renderer.setRenderTarget(renderTargetsVertical[i]);
            renderer.clear();
            renderer.render(this.screen, this.screenCamera);

            inputRenderTarget = renderTargetsVertical[i];
        }

        // Composite all the mips
        this.screen.material = this.bloomCompositeMaterial;
        renderer.setRenderTarget(renderTargetsHorizontal[0]);
        renderer.clear();
        renderer.render(this.screen, this.screenCamera);

        // Composite pass (render to screen)
        this.compositeMaterial.uniforms.tScene.value = renderTarget.texture;
        this.compositeMaterial.uniforms.tBloom.value = renderTargetsHorizontal[0].texture;
        this.screen.material = this.compositeMaterial;
        renderer.setRenderTarget(null);
        renderer.clear();
        renderer.render(this.screen, this.screenCamera);

        // Transition pass (render to screen)
        if (this.transitionMaterial.uniforms.uProgress.value > 0) {
            this.screen.material = this.transitionMaterial;
            renderer.render(this.screen, this.screenCamera);
        }
    };

    static animateOut = callback => {
        clearTween(this.transitionMaterial.uniforms.uProgress);
        clearTween(this.transitionMaterial.uniforms.uPower);

        this.transitionMaterial.uniforms.uProgress.value = 0;
        this.transitionMaterial.uniforms.uPower.value = 0;
        this.transitionMaterial.uniforms.uOut.value = true;

        tween(this.transitionMaterial.uniforms.uProgress, { value: 1 }, 1250, 'easeInOutQuart', () => {
            if (callback) {
                callback();
            }
        });

        tween(this.transitionMaterial.uniforms.uPower, { value: 1 }, 500, 'linear', () => {
            tween(this.transitionMaterial.uniforms.uPower, { value: 0 }, 500, 'linear');
        });
    };

    static animateIn = callback => {
        clearTween(this.transitionMaterial.uniforms.uProgress);
        clearTween(this.transitionMaterial.uniforms.uPower);

        this.transitionMaterial.uniforms.uProgress.value = 1;
        this.transitionMaterial.uniforms.uPower.value = 0;
        this.transitionMaterial.uniforms.uOut.value = false;

        tween(this.transitionMaterial.uniforms.uProgress, { value: 0 }, 1250, 'easeInOutQuart', () => {
            this.transitionMaterial.uniforms.uOut.value = true;

            if (callback) {
                callback();
            }
        });

        tween(this.transitionMaterial.uniforms.uPower, { value: 1 }, 500, 'linear', () => {
            tween(this.transitionMaterial.uniforms.uPower, { value: 0 }, 500, 'linear');
        });
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
            antialias: true
        });

        // Disable color management
        ColorManagement.enabled = false;
        this.renderer.outputColorSpace = LinearSRGBColorSpace;

        // Output canvas
        this.element = this.renderer.domElement;

        // 3D scene
        this.scene = new Scene();
        this.scene.background = new Color(0x060606);
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
        this.scene.add(new HemisphereLight(0x606060, 0x404040, 3));

        const light = new DirectionalLight(0xffffff, 2);
        light.position.set(0.6, 0.5, 1);
        this.scene.add(light);
    }

    static initLoaders() {
        this.textureLoader = new TextureLoader();
        this.textureLoader.setPath('/examples/');

        this.environmentLoader = new EnvironmentTextureLoader(this.renderer);
        this.environmentLoader.setPath('/examples/');
    }

    static async initEnvironment() {
        this.scene.environment = await this.loadEnvironmentTexture('assets/textures/env/jewelry_black_contrast.jpg');
        this.scene.environmentIntensity = 1.2;
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
        this.assetLoader.setPath('/examples/three/');
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
        const data = await this.assetLoader.loadData('transitions/data.json');

        Data.init(data);
    }

    static initRouter() {
        Data.pages.forEach(page => {
            Router.add(page.path, Page, page);
        });

        // Landing and 404 page
        const home = Data.pages[0]; // Dark Planet

        Router.add('/', Page, home);
        Router.add('404', Page, home);

        Router.init({ path: '/examples/three/transitions/shader' });
    }

    static initViews() {
        this.view = new SceneView();
        WorldController.scene.add(this.view);

        this.ui = new UI({ fps: true, breakpoint });
        this.ui.container = new UIContainer();
        this.ui.add(this.ui.container);
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
        SceneController.resize();
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
