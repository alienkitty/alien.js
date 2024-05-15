import { AssetLoader, BloomCompositeMaterial, BlurMaterial, BoxGeometry, Color, ColorManagement, Details, DirectionalLight, EnvironmentTextureLoader, GLSL3, Group, HemisphereLight, IcosahedronGeometry, ImageBitmapLoaderThread, Interface, LinearSRGBColorSpace, LuminosityMaterial, MathUtils, Mesh, MeshStandardMaterial, NoBlending, OctahedronGeometry, OrthographicCamera, PanelItem, PerspectiveCamera, RawShaderMaterial, RepeatWrapping, Scene, SceneCompositeMaterial, Smooth, Stage, TextureLoader, Thread, UI, UnrealBloomBlurMaterial, Vector2, WebGLRenderTarget, WebGLRenderer, clearTween, defer, getFullscreenTriangle, ticker, tween } from '../../../../build/alien.three.js';

const isDebug = /[?&]debug/.test(location.search);

const breakpoint = 1000;

class Data {
    static init({ pages }) {
        this.sections = pages;
        this.sectionIndex = 0;

        this.setIndexes();
    }

    static setIndexes() {
        this.sections.forEach((section, i) => section.index = i);
    }
}

class Section extends Interface {
    constructor({ title, index }) {
        super('.section');

        this.title = title;
        this.index = index;
        this.animatedIn = false;

        this.init();
        this.initViews();

        this.addListeners();
    }

    init() {
        this.css({
            position: 'relative',
            height: '100svh'
        });

        if (isDebug) {
            this.css({
                backgroundColor: `rgb(
                    ${Math.floor(Math.random() * 255)}
                    ${Math.floor(Math.random() * 255)}
                    ${Math.floor(Math.random() * 255)}
                    / 0.5
                )`
            });
        }
    }

    initViews() {
        this.details = new Details({
            title: this.title.replace(/[\s.]+/g, '_'),
            content: /* html */ `
Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
            `,
            links: [
                {
                    title: 'Lorem ipsum',
                    link: 'https://en.wikipedia.org/wiki/Lorem_ipsum'
                }
            ]
        });
        this.add(this.details);
    }

    async addListeners() {
        await defer();

        this.observer = new IntersectionObserver(this.onIntersect, {
            threshold: 0.5
        });
        this.observer.observe(this.element);
    }

    // Event handlers

    onIntersect = ([entry]) => {
        if (entry.isIntersecting) {
            Stage.events.emit('view_change', { index: this.index });

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

        this.init();
        this.initViews();
    }

    init() {
        this.css({ position: 'static' });
    }

    initViews() {
        this.darkPlanet = new Section(Data.sections[0]);
        this.add(this.darkPlanet);

        this.floatingCrystal = new Section(Data.sections[1]);
        this.add(this.floatingCrystal);

        this.abstractCube = new Section(Data.sections[2]);
        this.add(this.abstractCube);
    }
}

import rgbshift from '../../../../src/shaders/modules/rgbshift/rgbshift.glsl.js';
import dither from '../../../../src/shaders/modules/dither/dither.glsl.js';

class CompositeMaterial extends RawShaderMaterial {
    constructor() {
        super({
            glslVersion: GLSL3,
            uniforms: {
                tScene: { value: null },
                uColor: { value: new Color(0x060606) },
                uDistortion: { value: 1.5 },
                uOpacity: { value: 0 }
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

                uniform sampler2D tScene;
                uniform vec3 uColor;
                uniform float uDistortion;
                uniform float uOpacity;

                in vec2 vUv;

                out vec4 FragColor;

                ${rgbshift}
                ${dither}

                void main() {
                    FragColor = getRGB(tScene, vUv, 0.1, 0.002 * uDistortion * (1.0 - uOpacity));

                    FragColor.rgb = mix(uColor, FragColor.rgb, uOpacity);

                    FragColor.rgb = dither(FragColor.rgb);
                    FragColor.a = 1.0;
                }
            `,
            blending: NoBlending,
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

        this.addListeners();
    }

    static addListeners() {
        Stage.events.on('view_change', this.onViewChange);
    }

    // Event handlers

    static onViewChange = ({ index }) => {
        if (index !== Data.sectionIndex) {
            Data.sectionIndex = index;

            RenderManager.setView(index);
        }
    };

    // Public methods

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
        this.setView(Data.sectionIndex);

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
        const { luminosityMaterial, bloomCompositeMaterial, compositeMaterial } = RenderManager;

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
                name: 'Blur',
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
                name: 'Opacity',
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
                name: 'Lerp',
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
    static init(renderer, scene, camera, view, container) {
        this.renderer = renderer;
        this.scene = scene;
        this.camera = camera;
        this.views = view.children;
        this.container = container;
        this.sections = container.children;

        // Blur
        this.blurFactor = 10;

        // Bloom
        this.luminosityThreshold = 0.1;
        this.luminositySmoothing = 1;
        this.bloomStrength = 0.3;
        this.bloomRadius = 0.2;

        this.enabled = true;
        this.animatedIn = false;

        this.initRenderer();

        this.addListeners();
    }

    static initRenderer() {
        const { screenTriangle } = WorldController;

        // Fullscreen triangle
        this.screenCamera = new OrthographicCamera(-1, 1, 1, -1, 0, 1);
        this.screen = new Mesh(screenTriangle);
        this.screen.frustumCulled = false;

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

        // Gaussian blur materials
        this.hBlurMaterial = new BlurMaterial(BlurDirectionX);
        this.hBlurMaterial.uniforms.uBluriness.value = this.blurFactor;

        this.vBlurMaterial = new BlurMaterial(BlurDirectionY);
        this.vBlurMaterial.uniforms.uBluriness.value = this.blurFactor;

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

        // Composite materials
        this.sceneCompositeMaterial = new SceneCompositeMaterial();
        this.compositeMaterial = new CompositeMaterial();
    }

    static bloomFactors() {
        const bloomFactors = [1, 0.8, 0.6, 0.4, 0.2];

        for (let i = 0, l = this.nMips; i < l; i++) {
            const factor = bloomFactors[i];
            bloomFactors[i] = this.bloomStrength * MathUtils.lerp(factor, 1.2 - factor, this.bloomRadius);
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

    // Public methods

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

        // Gaussian blur
        this.hBlurMaterial.uniforms.uResolution.value.set(width, height);
        this.vBlurMaterial.uniforms.uResolution.value.set(width, height);

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
            renderer.render(scene, camera);
            return;
        }

        const renderTargetA = this.renderTargetA;
        const renderTargetB = this.renderTargetB;
        const renderTargetBright = this.renderTargetBright;
        const renderTargetsHorizontal = this.renderTargetsHorizontal;
        const renderTargetsVertical = this.renderTargetsVertical;

        // Scene pass
        renderer.setRenderTarget(renderTargetA);
        renderer.render(scene, camera);

        // Extract bright areas
        this.luminosityMaterial.uniforms.tMap.value = renderTargetA.texture;
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

        // Scene composite pass
        this.sceneCompositeMaterial.uniforms.tScene.value = renderTargetA.texture;
        this.sceneCompositeMaterial.uniforms.tBloom.value = renderTargetsHorizontal[0].texture;
        this.screen.material = this.sceneCompositeMaterial;
        renderer.setRenderTarget(renderTargetB);
        renderer.render(this.screen, this.screenCamera);

        // Two pass Gaussian blur (horizontal and vertical)
        const blurFactor = MathUtils.clamp(MathUtils.inverseLerp(0.5, 0, this.compositeMaterial.uniforms.uOpacity.value), 0, 1);

        if (blurFactor > 0) {
            this.hBlurMaterial.uniforms.tMap.value = renderTargetB.texture;
            this.hBlurMaterial.uniforms.uBluriness.value = this.blurFactor * blurFactor;
            this.screen.material = this.hBlurMaterial;
            renderer.setRenderTarget(renderTargetA);
            renderer.render(this.screen, this.screenCamera);

            this.vBlurMaterial.uniforms.tMap.value = renderTargetA.texture;
            this.vBlurMaterial.uniforms.uBluriness.value = this.blurFactor * blurFactor;
            this.screen.material = this.vBlurMaterial;
            renderer.setRenderTarget(renderTargetB);
            renderer.render(this.screen, this.screenCamera);
        }

        // Composite pass (render to screen)
        this.compositeMaterial.uniforms.tScene.value = renderTargetB.texture;
        this.screen.material = this.compositeMaterial;
        renderer.setRenderTarget(null);
        renderer.render(this.screen, this.screenCamera);
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
        this.camera.lookAt(-1.5, 0, -2);
        this.camera.zoom = 1.5;

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

        if (width < breakpoint) {
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
        Stage.init(document.querySelector('#root'));
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

    static initViews() {
        this.view = new SceneView();
        WorldController.scene.add(this.view);

        this.container = new Container();
        Stage.add(this.container);

        this.ui = new UI({ fps: true, breakpoint });
        Stage.add(this.ui);
    }

    static initControllers() {
        const { renderer, scene, camera } = WorldController;

        SceneController.init(this.view);
        RenderManager.init(renderer, scene, camera, this.view, this.container);
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
        RenderManager.animateIn();
        this.ui.animateIn();

        Stage.tween({ opacity: 1 }, 1000, 'linear', () => {
            Stage.css({ opacity: '' });
        });
    };
}

App.init();
