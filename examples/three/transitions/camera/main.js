import { AdditiveBlending, AssetLoader, BasicShadowMap, BloomCompositeMaterial, BoxGeometry, Color, ColorManagement, CopyMaterial, DepthMaterial, DirectionalLight, DisplayOptions, DrawBuffers, EnvironmentTextureLoader, GLSL3, Group, HemisphereLight, IcosahedronGeometry, ImageBitmapLoaderThread, LinearSRGBColorSpace, LuminosityMaterial, MapControls, MathUtils, Mesh, MeshBasicMaterial, MeshMatcapMaterial, MeshStandardMaterial, MotionBlurCompositeMaterial, NearestFilter, NoBlending, NormalMaterial, OctahedronGeometry, OrthographicCamera, PanelItem, PerspectiveCamera, PlaneGeometry, Point3D, RawShaderMaterial, Reflector, RepeatWrapping, Scene, SceneCompositeMaterial, ShadowMaterial, Stage, TextureLoader, UI, UnrealBloomBlurMaterial, Vector2, Vector3, WebGLRenderTarget, WebGLRenderer, clearTween, delayedCall, getFullscreenTriangle, getKeyByValue, lerpCameras, router, ticker, tween } from '../../../../build/alien.three.js';

const isDebug = /[?&]debug/.test(location.search);

const basePath = '/examples/three/transitions/camera';
const breakpoint = 1000;

const layers = {
    default: 0,
    buffers: 1
};

const params = {
    animate: true,
    speed: 1
};

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

import smootherstep from '../../../../src/shaders/modules/smootherstep/smootherstep.glsl.js';
import rotateUV from '../../../../src/shaders/modules/transformUV/rotateUV.glsl.js';
import rgbshift from '../../../../src/shaders/modules/rgbshift/rgbshift.glsl.js';
import dither from '../../../../src/shaders/modules/dither/dither.glsl.js';

class CompositeMaterial extends RawShaderMaterial {
    constructor() {
        super({
            glslVersion: GLSL3,
            uniforms: {
                tScene: { value: null },
                uFocus: { value: 0.5 },
                uRotation: { value: 0 },
                uBlurAmount: { value: 1 },
                uRGBAmount: { value: 1.5 }
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
                uniform float uFocus;
                uniform float uRotation;
                uniform float uBlurAmount;
                uniform float uRGBAmount;

                in vec2 vUv;

                out vec4 FragColor;

                ${smootherstep}
                ${rotateUV}
                ${rgbshift}
                ${dither}

                void main() {
                    float d = abs(uFocus - rotateUV(vUv, uRotation).y);
                    float t = smootherstep(0.0, 1.0, d);

                    float angle = length(vUv - 0.5);
                    float amount = 0.002 * uRGBAmount * uBlurAmount * t;

                    FragColor += getRGB(tScene, vUv, angle, amount);

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

import blur from '../../../../src/shaders/modules/blur/blur.glsl.js';
import blueNoise from '../../../../src/shaders/modules/noise/blue-noise.glsl.js';

class BlurMaterial extends RawShaderMaterial {
    constructor(direction = new Vector2(0.5, 0.5)) {
        const { getTexture } = WorldController;

        const texture = getTexture('blue_noise.png');
        texture.wrapS = RepeatWrapping;
        texture.wrapT = RepeatWrapping;
        texture.magFilter = NearestFilter;
        texture.minFilter = NearestFilter;
        texture.generateMipmaps = false;

        super({
            glslVersion: GLSL3,
            uniforms: {
                tMap: { value: null },
                tBlueNoise: { value: texture },
                uBlueNoiseResolution: { value: new Vector2(256, 256) },
                uFocus: { value: 0.5 },
                uRotation: { value: 0 },
                uBlurAmount: { value: 1 },
                uDirection: { value: direction },
                uDebug: { value: isDebug },
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

                uniform sampler2D tMap;
                uniform sampler2D tBlueNoise;
                uniform vec2 uBlueNoiseResolution;
                uniform float uFocus;
                uniform float uRotation;
                uniform float uBlurAmount;
                uniform vec2 uDirection;
                uniform bool uDebug;
                uniform vec2 uResolution;
                uniform float uTime;

                in vec2 vUv;

                out vec4 FragColor;

                vec2 rot2d(vec2 p, float a) {
                    vec2 sc = vec2(sin(a), cos(a));
                    return vec2(dot(p, vec2(sc.y, -sc.x)), dot(p, sc.xy));
                }

                ${smootherstep}
                ${rotateUV}
                ${blur}
                ${blueNoise}

                void main() {
                    float d = abs(uFocus - rotateUV(vUv, uRotation).y);
                    float t = smootherstep(0.0, 1.0, d);
                    float rnd = getBlueNoise(tBlueNoise, gl_FragCoord.xy, uBlueNoiseResolution, vec2(fract(uTime)));

                    FragColor = blur(tMap, vUv, uResolution, 20.0 * uBlurAmount * t * rot2d(uDirection, rnd));

                    if (uDebug) {
                        FragColor.rgb = mix(FragColor.rgb, mix(FragColor.rgb, vec3(1), 0.5), uBlurAmount * t);
                    }
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

        this.position.x = 2.5;

        this.initCamera();
    }

    initCamera() {
        this.camera = new PerspectiveCamera(30);
        this.camera.near = 0.5;
        this.camera.far = 40;
        this.camera.position.z = 8;
        this.camera.zoom = 1.5;
        this.camera.lookAt(this.position.x - 1.2, this.position.y, 0);
        this.camera.matrixAutoUpdate = false;
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
            name: 'Abstract Cube',
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
            flatShading: true,
            polygonOffset: true,
            polygonOffsetFactor: 1,
            polygonOffsetUnits: 1
        });

        // Second channel for aoMap and lightMap
        // https://threejs.org/docs/#api/en/materials/MeshStandardMaterial.aoMap
        material.aoMap.channel = 1;

        const mesh = new Mesh(geometry, material);
        mesh.rotation.x = MathUtils.degToRad(-45);
        mesh.rotation.z = MathUtils.degToRad(-45);
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        mesh.layers.enable(layers.buffers);
        this.add(mesh);

        this.mesh = mesh;
    }

    // Public methods

    resize = (width, height) => {
        this.camera.aspect = width / height;

        if (width < breakpoint) {
            this.camera.lookAt(this.position.x, this.position.y, 0);
            this.camera.zoom = 1;
        } else {
            this.camera.lookAt(this.position.x - 1.2, this.position.y, 0);
            this.camera.zoom = 1.5;
        }

        this.camera.updateProjectionMatrix();
    };

    update = () => {
        this.mesh.rotation.y -= 0.005 * params.speed;
    };

    ready = () => this.initMesh();
}

class FloatingCrystal extends Group {
    constructor() {
        super();

        this.position.y = 0.7;

        this.initCamera();
    }

    initCamera() {
        this.camera = new PerspectiveCamera(30);
        this.camera.near = 0.5;
        this.camera.far = 40;
        this.camera.position.z = 8;
        this.camera.zoom = 1.5;
        this.camera.lookAt(this.position.x - 1.3, this.position.y, 0);
        this.camera.matrixAutoUpdate = false;
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
            name: 'Floating Crystal',
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
            flatShading: true,
            polygonOffset: true,
            polygonOffsetFactor: 1,
            polygonOffsetUnits: 1
        });

        // Second channel for aoMap and lightMap
        // https://threejs.org/docs/#api/en/materials/MeshStandardMaterial.aoMap
        material.aoMap.channel = 1;

        const mesh = new Mesh(geometry, material);
        mesh.scale.set(0.5, 1, 0.5);
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        mesh.layers.enable(layers.buffers);
        this.add(mesh);

        this.mesh = mesh;
    }

    // Public methods

    resize = (width, height) => {
        this.camera.aspect = width / height;

        if (width < breakpoint) {
            this.camera.lookAt(this.position.x, this.position.y, 0);
            this.camera.zoom = 1;
        } else {
            this.camera.lookAt(this.position.x - 1.3, this.position.y, 0);
            this.camera.zoom = 1.5;
        }

        this.camera.updateProjectionMatrix();
    };

    update = time => {
        this.mesh.position.y = (1 + Math.sin(time * params.speed)) * 0.1;
        this.mesh.rotation.y += 0.01 * params.speed;
    };

    ready = () => this.initMesh();
}

class DarkPlanet extends Group {
    constructor() {
        super();

        this.position.x = -2.5;

        // 25 degree tilt like Mars
        this.rotation.z = MathUtils.degToRad(25);

        this.initCamera();
    }

    initCamera() {
        this.camera = new PerspectiveCamera(30);
        this.camera.near = 0.5;
        this.camera.far = 40;
        this.camera.position.z = 8;
        this.camera.zoom = 1.5;
        this.camera.lookAt(this.position.x - 1.4, this.position.y, 0);
        this.camera.matrixAutoUpdate = false;
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
            name: 'Dark Planet',
            color: new Color().offsetHSL(0, 0, -0.65),
            metalness: 0.7,
            roughness: 2,
            map,
            metalnessMap: ormMap,
            roughnessMap: ormMap,
            aoMap: ormMap,
            aoMapIntensity: 1,
            normalMap,
            normalScale: new Vector2(3, 3),
            polygonOffset: true,
            polygonOffsetFactor: 1,
            polygonOffsetUnits: 1
        });

        // Second channel for aoMap and lightMap
        // https://threejs.org/docs/#api/en/materials/MeshStandardMaterial.aoMap
        material.aoMap.channel = 1;

        const mesh = new Mesh(geometry, material);
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        mesh.layers.enable(layers.buffers);
        this.add(mesh);

        this.mesh = mesh;
    }

    // Public methods

    resize = (width, height) => {
        this.camera.aspect = width / height;

        if (width < breakpoint) {
            this.camera.lookAt(this.position.x, this.position.y, 0);
            this.camera.zoom = 1;
        } else {
            this.camera.lookAt(this.position.x - 1.4, this.position.y, 0);
            this.camera.zoom = 1.5;
        }

        this.camera.updateProjectionMatrix();
    };

    update = () => {
        // Counter clockwise rotation
        this.mesh.rotation.y += 0.005 * params.speed;
    };

    ready = () => this.initMesh();
}

class Floor extends Group {
    constructor() {
        super();

        this.initReflector();
    }

    initReflector() {
        this.reflector = new Reflector({ blurIterations: 6 });
    }

    async initMesh() {
        const { loadTexture } = WorldController;

        const geometry = new PlaneGeometry(100, 100);

        const map = await loadTexture('waterdudv.jpg');
        map.wrapS = RepeatWrapping;
        map.wrapT = RepeatWrapping;
        map.repeat.set(6, 3);

        const material = new ShadowMaterial({
            toneMapped: false
        });

        material.onBeforeCompile = shader => {
            map.updateMatrix();

            shader.uniforms.map = { value: map };
            shader.uniforms.reflectMap = { value: this.reflector.renderTarget.texture };
            shader.uniforms.reflectMapBlur = this.reflector.renderTargetUniform;
            shader.uniforms.uvTransform = { value: map.matrix };
            shader.uniforms.textureMatrix = this.reflector.textureMatrixUniform;

            shader.vertexShader = shader.vertexShader.replace(
                'void main() {',
                /* glsl */ `
                uniform mat3 uvTransform;
                uniform mat4 textureMatrix;

                out vec2 vUv;
                out vec4 vCoord;

                void main() {
                `
            );

            shader.vertexShader = shader.vertexShader.replace(
                '#include <project_vertex>',
                /* glsl */ `
                #include <project_vertex>

                vUv = (uvTransform * vec3(uv, 1)).xy;
                vCoord = textureMatrix * vec4(transformed, 1.0);
                `
            );

            shader.fragmentShader = shader.fragmentShader.replace(
                'void main() {',
                /* glsl */ `
                uniform sampler2D map;
                uniform sampler2D reflectMap;
                uniform sampler2D reflectMapBlur;

                in vec2 vUv;
                in vec4 vCoord;

                ${dither}

                void main() {
                `
            );

            shader.fragmentShader = shader.fragmentShader.replace(
                'gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );',
                /* glsl */ `
                vec2 reflectionUv = vCoord.xy / vCoord.w;

                vec4 dudv = texture(map, vUv);
                vec4 color = texture(reflectMap, reflectionUv);

                vec4 blur;

                blur = texture(reflectMapBlur, reflectionUv + dudv.rg / 256.0);
                color = mix(color, blur, smoothstep(1.0, 0.1, dudv.g));

                blur = texture(reflectMapBlur, reflectionUv);
                color = mix(color, blur, smoothstep(0.5, 1.0, dudv.r));

                gl_FragColor = color * mix(0.3, 0.55, dudv.g);

                gl_FragColor.rgb -= (1.0 - getShadowMask()) * 0.025;

                gl_FragColor.rgb = dither(gl_FragColor.rgb);
                `
            );
        };

        const mesh = new Mesh(geometry, material);
        mesh.position.y = -0.86;
        mesh.rotation.x = -Math.PI / 2;
        mesh.receiveShadow = true;
        mesh.add(this.reflector);

        mesh.onBeforeRender = (renderer, scene, camera) => {
            this.visible = false;
            this.reflector.update(renderer, scene, camera);
            this.visible = true;
        };

        this.add(mesh);
    }

    // Public methods

    resize = (width, height) => {
        height = 1024;

        this.reflector.setSize(width, height);
    };

    ready = () => this.initMesh();
}

class SceneView extends Group {
    constructor() {
        super();

        this.visible = false;

        this.initViews();
    }

    initViews() {
        this.floor = new Floor();
        this.add(this.floor);

        this.darkPlanet = new DarkPlanet();
        this.add(this.darkPlanet);

        this.floatingCrystal = new FloatingCrystal();
        this.add(this.floatingCrystal);

        this.abstractCube = new AbstractCube();
        this.add(this.abstractCube);
    }

    // Public methods

    resize = (width, height) => {
        this.floor.resize(width, height);
        this.darkPlanet.resize(width, height);
        this.floatingCrystal.resize(width, height);
        this.abstractCube.resize(width, height);
    };

    update = time => {
        this.darkPlanet.update(time);
        this.floatingCrystal.update(time);
        this.abstractCube.update(time);
    };

    ready = () => Promise.all([
        this.floor.ready(),
        this.darkPlanet.ready(),
        this.floatingCrystal.ready(),
        this.abstractCube.ready()
    ]);
}

class SceneController {
    static init(view) {
        this.view = view;

        this.animatedOneFramePast = false;
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

        CameraController.setView(view);
    };

    // Public methods

    static resize = (width, height, dpr) => {
        this.view.resize(width, height, dpr);
    };

    static update = time => {
        if (!this.view.visible) {
            return;
        }

        if (params.animate || !this.animatedOneFramePast) {
            this.view.update(time);

            this.animatedOneFramePast = !params.animate;
        }
    };

    static animateIn = () => {
        this.addListeners();
        this.onPopState();

        this.view.visible = true;
    };

    static ready = () => this.view.ready();
}

class ScenePanelController {
    static init(view) {
        this.view = view;

        this.initPanel();

        this.addListeners();
    }

    static initPanel() {
        const { darkPlanet, floatingCrystal, abstractCube } = this.view;

        const objects = [darkPlanet, floatingCrystal, abstractCube];

        objects.forEach(object => {
            object.point = new Point3D(object.mesh, {
                type: '',
                noTracker: true
            });
            object.add(object.point);
        });

        // Shrink tracker meshes a little bit
        floatingCrystal.point.mesh.scale.multiply(new Vector3(1, 0.9, 1));
        abstractCube.point.mesh.scale.multiplyScalar(0.9);
    }

    static addListeners() {
        Point3D.events.on('click', this.onClick);
    }

    // Event handlers

    static onClick = ({ target }) => {
        const data = Data.pages[target.index];

        if (data && data.path) {
            const path = router.getPath(data.path);

            router.setPath(`${path}/`);

            Point3D.animateOut();
        }
    };
}

class PanelController {
    static init(renderer, scene, camera, view, ui) {
        this.renderer = renderer;
        this.scene = scene;
        this.camera = camera;
        this.view = view;
        this.ui = ui;

        this.initControllers();
        this.initPanel();
    }

    static initControllers() {
        Point3D.init(this.renderer, this.scene, this.camera, {
            root: Stage,
            container: this.ui,
            debug: isDebug
        });

        ScenePanelController.init(this.view);
    }

    static initPanel() {
        const { drawBuffers, hBlurMaterial, vBlurMaterial, luminosityMaterial, bloomCompositeMaterial, compositeMaterial } = RenderManager;

        const items = [
            {
                name: 'FPS'
            },
            {
                type: 'divider'
            },
            {
                type: 'list',
                list: DisplayOptions,
                value: getKeyByValue(DisplayOptions, RenderManager.display),
                callback: value => {
                    RenderManager.display = DisplayOptions.get(value);
                }
            },
            {
                type: 'divider'
            },
            {
                type: 'toggle',
                name: 'Animate',
                value: params.animate,
                callback: value => {
                    params.animate = value;
                    drawBuffers.saveState = params.animate;
                }
            },
            {
                type: 'slider',
                name: 'Speed',
                min: 0,
                max: 50,
                step: 0.1,
                value: params.speed,
                callback: value => {
                    params.speed = value;
                }
            },
            {
                type: 'divider'
            },
            {
                type: 'slider',
                name: 'Interp',
                min: 0,
                max: 1,
                step: 0.01,
                value: drawBuffers.interpolateGeometry,
                callback: value => {
                    drawBuffers.interpolateGeometry = value;
                }
            },
            {
                type: 'slider',
                name: 'Smear',
                min: 0,
                max: 4,
                step: 0.02,
                value: drawBuffers.smearIntensity,
                callback: value => {
                    drawBuffers.smearIntensity = value;
                }
            },
            {
                type: 'divider'
            },
            {
                type: 'slider',
                name: 'Focus',
                min: 0,
                max: 1,
                step: 0.01,
                value: RenderManager.blurFocus,
                callback: value => {
                    hBlurMaterial.uniforms.uFocus.value = value;
                    vBlurMaterial.uniforms.uFocus.value = value;
                    compositeMaterial.uniforms.uFocus.value = value;
                }
            },
            {
                type: 'slider',
                name: 'Rotate',
                min: 0,
                max: 360,
                step: 1,
                value: MathUtils.radToDeg(RenderManager.blurRotation),
                callback: value => {
                    value = MathUtils.degToRad(value);
                    hBlurMaterial.uniforms.uRotation.value = value;
                    vBlurMaterial.uniforms.uRotation.value = value;
                    compositeMaterial.uniforms.uRotation.value = value;
                }
            },
            {
                type: 'slider',
                name: 'Blur',
                min: 0,
                max: 2,
                step: 0.01,
                value: RenderManager.blurAmount,
                callback: value => {
                    RenderManager.blurAmount = value;
                }
            },
            {
                type: 'slider',
                name: 'Chroma',
                min: 0,
                max: 10,
                step: 0.1,
                value: compositeMaterial.uniforms.uRGBAmount.value,
                callback: value => {
                    compositeMaterial.uniforms.uRGBAmount.value = value;
                }
            },
            {
                type: 'toggle',
                name: 'Debug',
                value: vBlurMaterial.uniforms.uDebug.value,
                callback: value => {
                    vBlurMaterial.uniforms.uDebug.value = value;
                }
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
            }
        ];

        items.forEach(data => {
            this.ui.addPanel(new PanelItem(data));
        });
    }

    // Public methods

    static update = time => {
        if (!this.ui) {
            return;
        }

        Point3D.update(time);
    };
}

const BlurDirectionX = new Vector2(1, 0);
const BlurDirectionY = new Vector2(0, 1);

class RenderManager {
    static init(renderer, scene, camera) {
        this.renderer = renderer;
        this.scene = scene;
        this.camera = camera;

        // Gaussian blur
        this.blurFocus = navigator.maxTouchPoints ? 0.5 : 0.25;
        this.blurRotation = navigator.maxTouchPoints ? 0 : MathUtils.degToRad(75);
        this.blurAmount = 1;

        // Unreal bloom
        this.luminosityThreshold = 0.1;
        this.luminositySmoothing = 1;
        this.bloomStrength = 0.3;
        this.bloomRadius = 0.2;

        // Debug
        this.display = DisplayOptions.get('Default');

        this.enabled = true;

        this.initRenderer();
    }

    static initRenderer() {
        const { screenTriangle, resolution, time, textureLoader, getTexture } = WorldController;

        // Manually clear
        this.renderer.autoClear = false;

        // Clear colors
        this.clearColor = new Color(0, 0, 0);
        this.currentClearColor = new Color();

        // Fullscreen triangle
        this.screenCamera = new OrthographicCamera(-1, 1, 1, -1, 0, 1);
        this.screen = new Mesh(screenTriangle);
        this.screen.frustumCulled = false;

        // Render targets
        this.renderTargetA = new WebGLRenderTarget(1, 1, {
            depthBuffer: false
        });

        this.renderTargetB = this.renderTargetA.clone();
        this.renderTargetC = this.renderTargetA.clone();

        this.renderTargetBright = this.renderTargetA.clone();
        this.renderTargetsHorizontal = [];
        this.renderTargetsVertical = [];
        this.nMips = 5;

        for (let i = 0, l = this.nMips; i < l; i++) {
            this.renderTargetsHorizontal.push(this.renderTargetA.clone());
            this.renderTargetsVertical.push(this.renderTargetA.clone());
        }

        this.renderTargetA.depthBuffer = true;

        // G-Buffer
        this.drawBuffers = new DrawBuffers(this.renderer, this.scene, this.camera, layers.buffers, {
            interpolateGeometry: 0
        });

        // Motion blur composite material
        this.motionBlurCompositeMaterial = new MotionBlurCompositeMaterial(textureLoader, {
            blueNoisePath: 'blue_noise.png'
        });
        this.motionBlurCompositeMaterial.uniforms.tVelocity.value = this.drawBuffers.renderTarget.textures[1];

        // Gaussian blur materials
        this.hBlurMaterial = new BlurMaterial(BlurDirectionX);
        this.hBlurMaterial.uniforms.uFocus.value = this.blurFocus;
        this.hBlurMaterial.uniforms.uRotation.value = this.blurRotation;
        this.hBlurMaterial.uniforms.uBlurAmount.value = this.blurAmount;
        this.hBlurMaterial.uniforms.uResolution = resolution;
        this.hBlurMaterial.uniforms.uTime = time;

        this.vBlurMaterial = new BlurMaterial(BlurDirectionY);
        this.vBlurMaterial.uniforms.uFocus.value = this.blurFocus;
        this.vBlurMaterial.uniforms.uRotation.value = this.blurRotation;
        this.vBlurMaterial.uniforms.uBlurAmount.value = this.blurAmount;
        this.vBlurMaterial.uniforms.uResolution = resolution;
        this.vBlurMaterial.uniforms.uTime = time;

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

        // Composite materials
        this.sceneCompositeMaterial = new SceneCompositeMaterial();

        this.compositeMaterial = new CompositeMaterial();
        this.compositeMaterial.uniforms.uFocus.value = this.blurFocus;
        this.compositeMaterial.uniforms.uRotation.value = this.blurRotation;
        this.compositeMaterial.uniforms.uBlurAmount.value = this.blurAmount;

        // Debug materials
        this.blackoutMaterial = new MeshBasicMaterial({ color: 0x000000 });
        this.matcap1Material = new MeshMatcapMaterial({ matcap: getTexture('matcaps/040full.jpg') });
        this.matcap2Material = new MeshMatcapMaterial({ matcap: getTexture('matcaps/defaultwax.jpg') });
        this.normalMaterial = new NormalMaterial();
        this.depthMaterial = new DepthMaterial();
        this.copyMaterial = new CopyMaterial();
    }

    static bloomFactors() {
        const bloomFactors = [1, 0.8, 0.6, 0.4, 0.2];

        for (let i = 0, l = this.nMips; i < l; i++) {
            const factor = bloomFactors[i];
            bloomFactors[i] = this.bloomStrength * MathUtils.lerp(factor, 1.2 - factor, this.bloomRadius);
        }

        return bloomFactors;
    }

    static rendererState() {
        this.currentOverrideMaterial = this.scene.overrideMaterial;
        this.currentBackground = this.scene.background;
        this.renderer.getClearColor(this.currentClearColor);
        this.currentClearAlpha = this.renderer.getClearAlpha();
    }

    static restoreRendererState() {
        this.scene.overrideMaterial = this.currentOverrideMaterial;
        this.scene.background = this.currentBackground;
        this.renderer.setClearColor(this.currentClearColor, this.currentClearAlpha);
    }

    // Public methods

    static resize = (width, height, dpr) => {
        this.renderer.setPixelRatio(dpr);
        this.renderer.setSize(width, height);

        width = Math.round(width * dpr);
        height = Math.round(height * dpr);

        this.renderTargetA.setSize(width, height);
        this.renderTargetB.setSize(width, height);
        this.renderTargetC.setSize(width, height);

        this.drawBuffers.setSize(width, height);

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
        const scene = this.scene;
        const camera = this.camera;

        if (!this.enabled) {
            renderer.setRenderTarget(null);
            renderer.clear();
            renderer.render(scene, camera);
            return;
        }

        const renderTargetA = this.renderTargetA;
        const renderTargetB = this.renderTargetB;
        const renderTargetC = this.renderTargetC;
        const renderTargetBright = this.renderTargetBright;
        const renderTargetsHorizontal = this.renderTargetsHorizontal;
        const renderTargetsVertical = this.renderTargetsVertical;

        // Renderer state
        this.rendererState();

        // G-Buffer layer
        camera.layers.set(layers.buffers);

        this.drawBuffers.update();

        if (this.display === DisplayOptions.get('Velocity')) {
            // Debug pass (render to screen)
            this.copyMaterial.uniforms.tMap.value = this.drawBuffers.renderTarget.textures[1];
            this.screen.material = this.copyMaterial;
            renderer.setRenderTarget(null);
            renderer.clear();
            renderer.render(this.screen, this.screenCamera);
            this.restoreRendererState();
            return;
        }

        // Scene layer
        camera.layers.set(layers.default);

        renderer.setRenderTarget(renderTargetA);
        renderer.clear();
        renderer.render(scene, camera);

        // Post-processing
        scene.background = null;
        renderer.setClearColor(this.clearColor, 1);

        // Debug override material passes (render to screen)
        if (this.display === DisplayOptions.get('Depth')) {
            scene.overrideMaterial = this.depthMaterial;
            renderer.setRenderTarget(null);
            renderer.clear();
            renderer.render(scene, camera);
            this.restoreRendererState();
            return;
        } else if (this.display === DisplayOptions.get('Geometry')) {
            scene.overrideMaterial = this.normalMaterial;
            renderer.setRenderTarget(null);
            renderer.clear();
            renderer.render(scene, camera);
            this.restoreRendererState();
            return;
        } else if (this.display === DisplayOptions.get('Matcap1')) {
            scene.overrideMaterial = this.matcap1Material;
            renderer.setRenderTarget(null);
            renderer.clear();
            renderer.render(scene, camera);
            this.restoreRendererState();
            return;
        } else if (this.display === DisplayOptions.get('Matcap2')) {
            scene.overrideMaterial = this.matcap2Material;
            renderer.setRenderTarget(null);
            renderer.clear();
            renderer.render(scene, camera);
            this.restoreRendererState();
            return;
        }

        // Motion blur pass
        this.motionBlurCompositeMaterial.uniforms.tMap.value = renderTargetA.texture;
        this.screen.material = this.motionBlurCompositeMaterial;
        renderer.setRenderTarget(renderTargetB);
        renderer.clear();
        renderer.render(this.screen, this.screenCamera);

        // Extract bright areas
        this.luminosityMaterial.uniforms.tMap.value = renderTargetB.texture;

        if (this.display === DisplayOptions.get('Luma')) {
            // Debug pass (render to screen)
            this.screen.material = this.blackoutMaterial;
            renderer.setRenderTarget(null);
            renderer.clear();
            renderer.render(this.screen, this.screenCamera);
            this.screen.material = this.luminosityMaterial;
            this.screen.material.blending = AdditiveBlending;
            renderer.render(this.screen, this.screenCamera);
            this.screen.material.blending = NoBlending;
            this.restoreRendererState();
            return;
        } else {
            this.screen.material = this.luminosityMaterial;
            renderer.setRenderTarget(renderTargetBright);
            renderer.clear();
            renderer.render(this.screen, this.screenCamera);
        }

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

        if (this.display === DisplayOptions.get('Bloom')) {
            // Debug pass (render to screen)
            renderer.setRenderTarget(null);
            renderer.clear();
            renderer.render(this.screen, this.screenCamera);
            this.restoreRendererState();
            return;
        } else {
            renderer.setRenderTarget(renderTargetsHorizontal[0]);
            renderer.clear();
            renderer.render(this.screen, this.screenCamera);
        }

        // Scene composite pass
        this.sceneCompositeMaterial.uniforms.tScene.value = renderTargetB.texture;
        this.sceneCompositeMaterial.uniforms.tBloom.value = renderTargetsHorizontal[0].texture;
        this.screen.material = this.sceneCompositeMaterial;
        renderer.setRenderTarget(renderTargetC);
        renderer.clear();
        renderer.render(this.screen, this.screenCamera);

        // Two pass Gaussian blur (horizontal and vertical)
        if (this.blurAmount) {
            this.hBlurMaterial.uniforms.tMap.value = renderTargetC.texture;
            this.hBlurMaterial.uniforms.uBlurAmount.value = this.blurAmount;
            this.screen.material = this.hBlurMaterial;
            renderer.setRenderTarget(renderTargetA);
            renderer.clear();
            renderer.render(this.screen, this.screenCamera);

            this.vBlurMaterial.uniforms.tMap.value = renderTargetA.texture;
            this.vBlurMaterial.uniforms.uBlurAmount.value = this.blurAmount;
            this.screen.material = this.vBlurMaterial;
            renderer.setRenderTarget(renderTargetC);
            renderer.clear();
            renderer.render(this.screen, this.screenCamera);
        }

        // Composite pass (render to screen)
        this.compositeMaterial.uniforms.tScene.value = renderTargetC.texture;
        this.compositeMaterial.uniforms.uBlurAmount.value = this.blurAmount;
        this.screen.material = this.compositeMaterial;
        renderer.setRenderTarget(null);
        renderer.clear();
        renderer.render(this.screen, this.screenCamera);

        // Restore renderer settings
        this.restoreRendererState();
    };

    static start = () => {
        this.blurAmount = 0;
    };

    static zoomIn = () => {
        clearTween(this.timeout);

        this.timeout = delayedCall(300, () => {
            tween(this, { blurAmount: 1 }, 1000, 'easeOutBack');
        });
    };

    static zoomOut = () => {
        clearTween(this.timeout);

        tween(this, { blurAmount: 0 }, 300, 'linear');
    };
}

class CameraController {
    static init(worldCamera, controlsCamera, controls, ui) {
        this.worldCamera = worldCamera;
        this.controlsCamera = controlsCamera;
        this.controls = controls;
        this.ui = ui;

        // Default camera
        this.camera = this.controlsCamera;

        this.progress = 0;
        this.isTransitioning = false;
        this.zoomedIn = false;
        this.enabled = false;
    }

    static transition() {
        clearTween(this);
        clearTween(this.timeout);

        this.controls.enabled = false;
        Point3D.enabled = false;

        this.progress = 0;
        this.isTransitioning = true;

        tween(this, { progress: 1 }, 1000, 'easeInOutSine', () => {
            this.isTransitioning = false;
        }, () => {
            lerpCameras(this.worldCamera, this.view.camera, this.progress);
        });

        if (this.zoomedIn) {
            this.ui.details.animateOut(() => {
                const { data } = router.get(location.pathname);

                this.ui.details.title.setTitle(data.title.replace(/[\s.-]+/g, '_'));

                const next = Data.getNext(data);
                const path = router.getPath(next.path);

                this.ui.link.setLink(next.path !== '/' ? `${path}/` : path);

                this.ui.details.animateIn();
            });

            RenderManager.zoomIn();
        } else {
            this.ui.details.animateOut();

            RenderManager.zoomOut();

            this.timeout = delayedCall(300, () => {
                this.controls.enabled = true;
                Point3D.enabled = true;
            });
        }
    }

    // Public methods

    static setView = view => {
        if (!navigator.maxTouchPoints && (!view || view === this.next)) {
            this.view = this;
            this.zoomedIn = false;
        } else {
            this.view = view;
            this.zoomedIn = true;
        }

        this.transition();
    };

    static resize = (width, height) => {
        this.worldCamera.aspect = width / height;
        this.worldCamera.updateProjectionMatrix();
    };

    static update = () => {
        if (!this.enabled || this.isTransitioning) {
            return;
        }

        this.worldCamera.position.copy(this.view.camera.position);
        this.worldCamera.quaternion.copy(this.view.camera.quaternion);
    };

    static animateIn = () => {
        this.enabled = true;
    };
}

class WorldController {
    static init() {
        this.initWorld();
        this.initLights();
        this.initLoaders();
        this.initEnvironment();
        this.initControls();

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

        // Shadows
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = BasicShadowMap;

        // 3D scene
        this.scene = new Scene();
        this.scene.background = new Color(0x060606);
        this.camera = new PerspectiveCamera(30);
        this.camera.near = 0.5;
        this.camera.far = 40;
        this.camera.position.set(0, 6, 8);
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
        light.position.set(5, 5, 5);
        light.castShadow = true;
        light.shadow.mapSize.width = 2048;
        light.shadow.mapSize.height = 2048;
        this.scene.add(light);
    }

    static initLoaders() {
        this.textureLoader = new TextureLoader();
        this.textureLoader.setPath('/examples/assets/textures/');
        this.textureLoader.cache = true;

        this.environmentLoader = new EnvironmentTextureLoader(this.renderer);
        this.environmentLoader.setPath('/examples/assets/textures/env/');
    }

    static async initEnvironment() {
        this.scene.environment = await this.loadEnvironmentTexture('jewelry_black_contrast.jpg');
        this.scene.environmentIntensity = 1.2;
    }

    static initControls() {
        this.controlsCamera = this.camera.clone();
        this.controls = new MapControls(this.controlsCamera, this.renderer.domElement);
        this.controls.enableDamping = true;
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
        width = Math.round(width * dpr);
        height = Math.round(height * dpr);

        this.resolution.value.set(width, height);
        this.texelSize.value.set(1 / width, 1 / height);
        this.aspect.value = width / height;
    };

    static update = (time, delta, frame) => {
        this.time.value = time;
        this.frame.value = frame;

        if (this.controls.enabled) {
            this.controls.update();
        }
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

        RenderManager.start();

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
        let home;

        if (!navigator.maxTouchPoints) {
            home = {
                path: '/',
                title: 'Camera Transition'
            };

            Data.pages.push(home);
        } else {
            home = Data.pages[0]; // Dark Planet
        }

        router.add('/', Page, home);
        router.add('404', Page, home);

        router.init({
            path: basePath,
            scrollRestoration: 'auto'
        });
    }

    static initViews() {
        this.view = new SceneView();
        WorldController.scene.add(this.view);

        this.ui = new UI({
            fps: true,
            breakpoint,
            details: {
                title: '',
                content: [
                    {
                        content: /* html */ `
<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
                        `,
                        links: [
                            {
                                title: 'Next'
                            }
                        ]
                    }
                ]
            }
        });
        this.ui.link = this.ui.details.links[0];
        Stage.add(this.ui);
    }

    static initControllers() {
        const { renderer, scene, camera, controlsCamera, controls } = WorldController;

        CameraController.init(camera, controlsCamera, controls, this.ui);
        SceneController.init(this.view);
        RenderManager.init(renderer, scene, camera);
    }

    static initPanel() {
        const { renderer, scene, camera } = WorldController;

        PanelController.init(renderer, scene, camera, this.view, this.ui);
    }

    static addListeners() {
        Stage.events.on('details', this.onDetails);
        window.addEventListener('resize', this.onResize);
        ticker.add(this.onUpdate);
        this.ui.link.events.on('click', this.onClick);
    }

    // Event handlers

    static onDetails = ({ open }) => {
        if (!open) {
            history.back();
        }
    };

    static onResize = () => {
        const width = document.documentElement.clientWidth;
        const height = document.documentElement.clientHeight;
        const dpr = window.devicePixelRatio;

        WorldController.resize(width, height, dpr);
        CameraController.resize(width, height);
        SceneController.resize(width, height);
        RenderManager.resize(width, height, dpr);
    };

    static onUpdate = (time, delta, frame) => {
        WorldController.update(time, delta, frame);
        CameraController.update();
        SceneController.update(time);
        RenderManager.update(time, delta, frame);
        PanelController.update(time);
        this.ui.update();
    };

    static onClick = (e, { target }) => {
        e.preventDefault();

        router.setPath(target.link);
    };

    // Public methods

    static animateIn = () => {
        CameraController.animateIn();
        SceneController.animateIn();
        this.ui.animateIn();

        Stage.tween({ opacity: 1 }, 1000, 'linear', () => {
            Stage.css({ opacity: '' });
        });
    };
}

App.init();
