import { AdditiveBlending, AssetLoader, BasicShadowMap, BloomCompositeMaterial, BoxGeometry, Color, ColorManagement, DepthMaterial, DirectionalLight, DisplayOptions, EnvironmentTextureLoader, GLSL3, Group, HemisphereLight, IcosahedronGeometry, ImageBitmapLoaderThread, LinearSRGBColorSpace, LuminosityMaterial, MathUtils, Mesh, MeshBasicMaterial, MeshMatcapMaterial, MeshStandardMaterial, MotionBlur, MotionBlurCompositeMaterial, NearestFilter, NoBlending, NormalMaterial, OctahedronGeometry, OrthographicCamera, PanelItem, PerspectiveCamera, PlaneGeometry, Point3D, RawShaderMaterial, Reflector, RepeatWrapping, Router, Scene, SceneCompositeMaterial, ShadowMaterial, Stage, TextureLoader, Thread, UI, UnrealBloomBlurMaterial, Vector2, Vector3, WebGLRenderTarget, WebGLRenderer, clearTween, delayedCall, getFullscreenTriangle, getKeyByValue, lerpCameras, ticker, tween } from '../../../../build/alien.three.js';

const isDebug = /[?&]debug/.test(location.search);

const breakpoint = 1000;

const layers = {
    default: 0,
    velocity: 1
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
        this.pageIndex = 0;
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
                uBluriness: { value: 1 },
                uDistortion: { value: 1.5 }
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
                uniform float uBluriness;
                uniform float uDistortion;

                in vec2 vUv;

                out vec4 FragColor;

                ${smootherstep}
                ${rotateUV}
                ${rgbshift}
                ${dither}

                void main() {
                    float d = abs(uFocus - rotateUV(vUv, uRotation).y);
                    float t = smootherstep(0.0, 1.0, d);

                    vec2 dir = 0.5 - vUv;
                    float angle = atan(dir.y, dir.x);
                    float amount = 0.002 * uDistortion * uBluriness * t;

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

        const texture = getTexture('assets/textures/blue_noise.png');
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
                uBluriness: { value: 1 },
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
                uniform float uBluriness;
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

                    FragColor = blur(tMap, vUv, uResolution, 20.0 * uBluriness * t * rot2d(uDirection, rnd));

                    if (uDebug) {
                        FragColor.rgb = mix(FragColor.rgb, mix(FragColor.rgb, vec3(1), 0.5), vec3(uBluriness * t));
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
        this.camera.lookAt(this.position.x - 1.2, this.position.y, 0);
        this.camera.zoom = 1.5;
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
            envMapIntensity: 1.2,
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

        // Layers
        mesh.layers.enable(layers.velocity);

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
        this.camera.lookAt(this.position.x - 1.3, this.position.y, 0);
        this.camera.zoom = 1.5;
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
            envMapIntensity: 1.2,
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

        // Layers
        mesh.layers.enable(layers.velocity);

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
        this.camera.lookAt(this.position.x - 1.4, this.position.y, 0);
        this.camera.zoom = 1.5;
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
            envMapIntensity: 1.2,
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

        // Layers
        mesh.layers.enable(layers.velocity);

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

        const map = await loadTexture('assets/textures/waterdudv.jpg');
        map.wrapS = RepeatWrapping;
        map.wrapT = RepeatWrapping;
        map.repeat.set(6, 3);

        const material = new ShadowMaterial({
            transparent: false,
            blending: NoBlending,
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
                gl_FragColor.a = 1.0;
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
        this.floor.initMesh(),
        this.darkPlanet.initMesh(),
        this.floatingCrystal.initMesh(),
        this.abstractCube.initMesh()
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
        const view = this.getView();

        CameraController.setView(view);
    };

    // Public methods

    static getView = () => {
        const { data } = Router.get(location.pathname);

        switch (data.path) {
            case '/dark_planet':
                return this.view.darkPlanet;
            case '/floating_crystal':
                return this.view.floatingCrystal;
            case '/abstract_cube':
                return this.view.abstractCube;
        }
    };

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

        const views = [darkPlanet, floatingCrystal, abstractCube];

        views.forEach(view => {
            view.point = new Point3D(view.mesh, {
                type: '',
                noTracker: true
            });
            view.add(view.point);
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
            const path = Router.getPath(data.path);

            Router.setPath(`${path}/`);
            Point3D.animateOut();
        }
    };
}

class PanelController {
    static init(scene, camera, view, ui) {
        this.scene = scene;
        this.camera = camera;
        this.view = view;
        this.ui = ui;

        this.initControllers();
        this.initPanel();
    }

    static initControllers() {
        Point3D.init(this.scene, this.camera, {
            root: Stage,
            container: this.ui,
            debug: isDebug
        });

        ScenePanelController.init(this.view);
    }

    static initPanel() {
        const { motionBlur, hBlurMaterial, vBlurMaterial, luminosityMaterial, bloomCompositeMaterial, compositeMaterial } = RenderManager;

        const debugOptions = {
            Off: false,
            Debug: true
        };

        const animateOptions = {
            Off: false,
            Animate: true
        };

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
                    RenderManager.display = DisplayOptions[value];
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
                value: motionBlur.interpolateGeometry,
                callback: value => {
                    motionBlur.interpolateGeometry = value;
                }
            },
            {
                type: 'slider',
                name: 'Smear',
                min: 0,
                max: 4,
                step: 0.02,
                value: motionBlur.smearIntensity,
                callback: value => {
                    motionBlur.smearIntensity = value;
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
                step: 0.3,
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
                value: RenderManager.blurFactor,
                callback: value => {
                    RenderManager.blurFactor = value;
                }
            },
            {
                type: 'slider',
                name: 'Chroma',
                min: 0,
                max: 10,
                step: 0.1,
                value: compositeMaterial.uniforms.uDistortion.value,
                callback: value => {
                    compositeMaterial.uniforms.uDistortion.value = value;
                }
            },
            {
                type: 'list',
                list: debugOptions,
                value: getKeyByValue(debugOptions, vBlurMaterial.uniforms.uDebug.value),
                callback: value => {
                    vBlurMaterial.uniforms.uDebug.value = debugOptions[value];
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
            },
            {
                type: 'divider'
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
                type: 'list',
                list: animateOptions,
                value: getKeyByValue(animateOptions, params.animate),
                callback: value => {
                    params.animate = animateOptions[value];
                    motionBlur.saveState = params.animate;
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

        // Blur
        this.blurFocus = navigator.maxTouchPoints ? 0.5 : 0.25;
        this.blurRotation = navigator.maxTouchPoints ? 0 : MathUtils.degToRad(75);
        this.blurFactor = 1;

        // Bloom
        this.luminosityThreshold = 0.1;
        this.luminositySmoothing = 1;
        this.bloomStrength = 0.3;
        this.bloomRadius = 0.2;

        // Debug
        this.display = DisplayOptions.Default;

        this.enabled = true;

        this.initRenderer();
    }

    static initRenderer() {
        const { screenTriangle, time, getTexture } = WorldController;

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

        this.renderTargetsHorizontal = [];
        this.renderTargetsVertical = [];
        this.nMips = 5;

        this.renderTargetBright = this.renderTargetA.clone();

        for (let i = 0, l = this.nMips; i < l; i++) {
            this.renderTargetsHorizontal.push(this.renderTargetA.clone());
            this.renderTargetsVertical.push(this.renderTargetA.clone());
        }

        this.renderTargetA.depthBuffer = true;

        // Motion blur
        this.motionBlur = new MotionBlur(this.renderer, this.scene, this.camera, layers.velocity, {
            interpolateGeometry: 0
        });

        this.motionBlurCompositeMaterial = new MotionBlurCompositeMaterial(7);
        this.motionBlurCompositeMaterial.uniforms.tVelocity.value = this.motionBlur.renderTarget.texture;

        // Gaussian blur materials
        this.hBlurMaterial = new BlurMaterial(BlurDirectionX);
        this.hBlurMaterial.uniforms.uFocus.value = this.blurFocus;
        this.hBlurMaterial.uniforms.uRotation.value = this.blurRotation;
        this.hBlurMaterial.uniforms.uBluriness.value = this.blurFactor;
        this.hBlurMaterial.uniforms.uTime = time;

        this.vBlurMaterial = new BlurMaterial(BlurDirectionY);
        this.vBlurMaterial.uniforms.uFocus.value = this.blurFocus;
        this.vBlurMaterial.uniforms.uRotation.value = this.blurRotation;
        this.vBlurMaterial.uniforms.uBluriness.value = this.blurFactor;
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
        this.compositeMaterial.uniforms.uFocus.value = this.blurFocus;
        this.compositeMaterial.uniforms.uRotation.value = this.blurRotation;
        this.compositeMaterial.uniforms.uBluriness.value = this.blurFactor;

        // Debug materials
        this.blackoutMaterial = new MeshBasicMaterial({ color: 0x000000 });
        this.matcap1Material = new MeshMatcapMaterial({ matcap: getTexture('assets/textures/matcaps/040full.jpg') });
        this.matcap2Material = new MeshMatcapMaterial({ matcap: getTexture('assets/textures/matcaps/defaultwax.jpg') });
        this.normalMaterial = new NormalMaterial();
        this.depthMaterial = new DepthMaterial();
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

        this.motionBlur.setSize(width, height);

        this.hBlurMaterial.uniforms.uResolution.value.set(width, height);
        this.vBlurMaterial.uniforms.uResolution.value.set(width, height);

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

        const renderTargetA = this.renderTargetA;
        const renderTargetB = this.renderTargetB;
        const renderTargetC = this.renderTargetC;
        const renderTargetBright = this.renderTargetBright;
        const renderTargetsHorizontal = this.renderTargetsHorizontal;
        const renderTargetsVertical = this.renderTargetsVertical;

        // Renderer state
        this.rendererState();

        // Scene layer
        camera.layers.set(layers.default);

        renderer.setRenderTarget(renderTargetA);
        renderer.clear();
        renderer.render(scene, camera);

        // Post-processing
        scene.background = null;
        renderer.setClearColor(this.clearColor, 1);

        if (this.display === DisplayOptions.Depth) {
            // Debug pass (render to screen)
            scene.overrideMaterial = this.depthMaterial;
            renderer.setRenderTarget(null);
            renderer.clear();
            renderer.render(scene, camera);
            this.restoreRendererState();
            return;
        } else if (this.display === DisplayOptions.Geometry) {
            scene.overrideMaterial = this.normalMaterial;
            renderer.setRenderTarget(null);
            renderer.clear();
            renderer.render(scene, camera);
            this.restoreRendererState();
            return;
        } else if (this.display === DisplayOptions.Matcap1) {
            scene.overrideMaterial = this.matcap1Material;
            renderer.setRenderTarget(null);
            renderer.clear();
            renderer.render(scene, camera);
            this.restoreRendererState();
            return;
        } else if (this.display === DisplayOptions.Matcap2) {
            scene.overrideMaterial = this.matcap2Material;
            renderer.setRenderTarget(null);
            renderer.clear();
            renderer.render(scene, camera);
            this.restoreRendererState();
            return;
        }

        // Motion blur layer
        camera.layers.set(layers.velocity);

        if (this.display === DisplayOptions.Velocity) {
            // Debug pass (render to screen)
            this.motionBlur.update(null);
            this.restoreRendererState();
            return;
        } else {
            this.motionBlur.update();
        }

        this.motionBlurCompositeMaterial.uniforms.tMap.value = renderTargetA.texture;
        this.screen.material = this.motionBlurCompositeMaterial;
        renderer.setRenderTarget(renderTargetB);
        renderer.clear();
        renderer.render(this.screen, this.screenCamera);

        // Extract bright areas
        this.luminosityMaterial.uniforms.tMap.value = renderTargetB.texture;

        if (this.display === DisplayOptions.Luma) {
            // Debug pass (render to screen)
            this.screen.material = this.blackoutMaterial;
            renderer.setRenderTarget(null);
            renderer.clear();
            renderer.render(this.screen, this.screenCamera);
            this.screen.material = this.luminosityMaterial;
            this.screen.material.blending = AdditiveBlending;
            renderer.render(this.screen, this.screenCamera);
            this.restoreRendererState();
            return;
        } else {
            this.screen.material = this.luminosityMaterial;
            this.screen.material.blending = NoBlending;
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

        if (this.display === DisplayOptions.Bloom) {
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
        if (this.blurFactor) {
            this.hBlurMaterial.uniforms.tMap.value = renderTargetC.texture;
            this.hBlurMaterial.uniforms.uBluriness.value = this.blurFactor;
            this.screen.material = this.hBlurMaterial;
            renderer.setRenderTarget(renderTargetA);
            renderer.clear();
            renderer.render(this.screen, this.screenCamera);

            this.vBlurMaterial.uniforms.tMap.value = renderTargetA.texture;
            this.vBlurMaterial.uniforms.uBluriness.value = this.blurFactor;
            this.screen.material = this.vBlurMaterial;
            renderer.setRenderTarget(renderTargetC);
            renderer.clear();
            renderer.render(this.screen, this.screenCamera);
        }

        // Composite pass (render to screen)
        this.compositeMaterial.uniforms.tScene.value = renderTargetC.texture;
        this.compositeMaterial.uniforms.uBluriness.value = this.blurFactor;
        this.screen.material = this.compositeMaterial;
        renderer.setRenderTarget(null);
        renderer.clear();
        renderer.render(this.screen, this.screenCamera);

        // Restore renderer settings
        this.restoreRendererState();
    };

    static start = () => {
        this.blurFactor = 0;
    };

    static zoomIn = () => {
        clearTween(this.timeout);

        this.timeout = delayedCall(300, () => {
            tween(this, { blurFactor: 1 }, 1000, 'easeOutBack');
        });
    };

    static zoomOut = () => {
        clearTween(this.timeout);

        tween(this, { blurFactor: 0 }, 300, 'linear');
    };
}

class CameraController {
    static init(worldCamera, ui) {
        this.worldCamera = worldCamera;
        this.ui = ui;

        // Start position
        this.camera = this.worldCamera.clone();
        this.mouse = new Vector2();
        this.lookAt = new Vector3();
        this.origin = new Vector3();
        this.target = new Vector3();
        this.targetXY = new Vector2(8, 4);
        this.origin.copy(this.camera.position);
        this.camera.lookAt(this.lookAt);

        this.progress = 0;
        this.lerpSpeed = 0.07;
        this.animatedIn = false;
        this.zoomedIn = false;
        this.enabled = false;

        this.addListeners();
    }

    static addListeners() {
        window.addEventListener('pointerdown', this.onPointerDown);
        window.addEventListener('pointermove', this.onPointerMove);
        window.addEventListener('pointerup', this.onPointerUp);
    }

    static transition() {
        Point3D.enabled = false;

        const next = this.next;

        this.progress = 0;

        tween(this, { progress: 1 }, 1000, 'easeInOutSine', () => {
            this.view = next;

            if (this.next !== this.view) {
                this.transition();
            } else {
                this.animatedIn = false;

                Point3D.enabled = true;
            }
        }, () => {
            lerpCameras(this.worldCamera, next.camera, this.progress);
        });

        if (this.zoomedIn) {
            this.ui.details.animateOut(() => {
                const { data } = Router.get(location.pathname);

                this.ui.details.title.setTitle(data.title.replace(/[\s.]+/g, '_'));

                const next = Data.getNext(data);
                const path = Router.getPath(next.path);

                this.ui.link.setLink(next.path !== '/' ? `${path}/` : path);

                this.ui.details.animateIn();
            });

            RenderManager.zoomIn();
        } else {
            this.ui.details.animateOut();

            RenderManager.zoomOut();
        }
    }

    // Event handlers

    static onPointerDown = e => {
        this.onPointerMove(e);
    };

    static onPointerMove = ({ clientX, clientY }) => {
        if (!this.enabled) {
            return;
        }

        this.mouse.x = (clientX / document.documentElement.clientWidth) * 2 - 1;
        this.mouse.y = 1 - (clientY / document.documentElement.clientHeight) * 2;
    };

    static onPointerUp = e => {
        this.onPointerMove(e);
    };

    // Public methods

    static setView = view => {
        if (!navigator.maxTouchPoints && (!view || view === this.next)) {
            this.next = this;
            this.zoomedIn = false;
        } else {
            this.next = view;
            this.zoomedIn = true;
        }

        if (!this.animatedIn) {
            this.animatedIn = true;

            this.transition();
        }
    };

    static resize = (width, height) => {
        this.worldCamera.aspect = width / height;
        this.worldCamera.updateProjectionMatrix();
    };

    static update = () => {
        if (!this.enabled) {
            return;
        }

        this.target.x = this.origin.x + this.targetXY.x * this.mouse.x;
        this.target.y = this.origin.y + this.targetXY.y * this.mouse.y;
        this.target.z = this.origin.z;

        this.camera.position.lerp(this.target, this.lerpSpeed);
        this.camera.lookAt(this.lookAt);

        if (!this.animatedIn) {
            this.updateCamera();
        }
    };

    static updateCamera = () => {
        this.worldCamera.position.copy(this.view.camera.position);
        this.worldCamera.quaternion.copy(this.view.camera.quaternion);
    };

    static start = () => {
        this.worldCamera.fov = 45;
        this.worldCamera.updateProjectionMatrix();
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

        this.addListeners();
    }

    static initWorld() {
        this.renderer = new WebGLRenderer({
            powerPreference: 'high-performance',
            antialias: true,
            stencil: false
        });

        // Disable color management
        ColorManagement.enabled = false;
        this.renderer.outputColorSpace = LinearSRGBColorSpace;

        // Output canvas
        this.element = this.renderer.domElement;

        // Shadows
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = BasicShadowMap;

        // 3D scene
        this.scene = new Scene();
        this.scene.background = new Color(0x0e0e0e);
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
        this.textureLoader.setPath('/examples/');

        this.environmentLoader = new EnvironmentTextureLoader(this.renderer);
        this.environmentLoader.setPath('/examples/');
    }

    static async initEnvironment() {
        this.scene.environment = await this.loadEnvironmentTexture('assets/textures/env/jewelry_black_contrast.jpg');
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
    };

    // Global handlers

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

        CameraController.start();
        RenderManager.start();

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
        let home;

        if (!navigator.maxTouchPoints) {
            home = {
                path: '/',
                title: 'Camera Transition'
            };

            Data.pages.push(home);
            Data.pageIndex = Data.pages.length - 1;
        } else {
            home = Data.pages[0]; // Dark Planet
        }

        Router.add('/', Page, home);
        Router.add('404', Page, home);

        Router.init({ path: '/examples/three/transitions/camera' });
    }

    static initViews() {
        this.view = new SceneView();
        WorldController.scene.add(this.view);

        this.ui = new UI({
            fps: true,
            breakpoint,
            details: {
                title: '',
                content: /* html */ `
Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                `,
                links: [
                    {
                        title: 'Next'
                    }
                ]
            }
        });
        this.ui.link = this.ui.details.links[0];
        Stage.add(this.ui);
    }

    static initControllers() {
        const { renderer, scene, camera } = WorldController;

        CameraController.init(camera, this.ui);
        SceneController.init(this.view);
        RenderManager.init(renderer, scene, camera);
    }

    static initPanel() {
        const { scene, camera } = WorldController;

        PanelController.init(scene, camera, this.view, this.ui);
    }

    static addListeners() {
        window.addEventListener('resize', this.onResize);
        ticker.add(this.onUpdate);
        this.ui.link.events.on('click', this.onClick);
    }

    // Event handlers

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

        Router.setPath(target.link);
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
