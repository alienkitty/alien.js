import { ACESFilmicToneMapping, CineonToneMapping, LinearToneMapping, NoToneMapping, ReinhardToneMapping } from 'three';

import { Config } from '../../config/Config.js';
import { Events } from '../../config/Events.js';
import { CameraController } from '../world/CameraController.js';
import { RenderManager } from '../world/RenderManager.js';
import { Stage } from '../../utils/Stage.js';
import { UI } from '../../utils/ui/UI.js';
import { Point3D } from '../../utils/ui/Point3D.js';
import { PanelItem } from '../../utils/panel/PanelItem.js';
import { ScenePanelController } from './ScenePanelController.js';

import { brightness, getKeyByValue } from '../../utils/Utils.js';

export class PanelController {
    static init(renderer, scene, camera, view) {
        this.renderer = renderer;
        this.scene = scene;
        this.camera = camera;
        this.view = view;

        this.lastInvert = null;

        this.initViews();
        this.initControllers();
        this.initPanel();
        this.setInvert(this.scene.background);
    }

    static initViews() {
        this.ui = new UI({ fps: true });
        this.ui.animateIn();
        Stage.add(this.ui);
    }

    static initControllers() {
        Point3D.init(this.scene, this.camera, {
            root: Stage,
            container: this.ui
        });

        ScenePanelController.init(this.view);
    }

    static initPanel() {
        const { luminosityMaterial, bloomCompositeMaterial } = RenderManager;

        // https://threejs.org/examples/#webgl_tonemapping
        const toneMappingOptions = {
            None: NoToneMapping,
            Linear: LinearToneMapping,
            Reinhard: ReinhardToneMapping,
            Cineon: CineonToneMapping,
            ACESFilmic: ACESFilmicToneMapping
        };

        const items = [
            {
                label: 'FPS'
            },
            {
                type: 'divider'
            },
            {
                type: 'color',
                value: this.scene.background,
                callback: value => {
                    this.scene.background.copy(value);

                    this.setInvert(this.scene.background);
                }
            },
            {
                type: 'divider'
            },
            {
                type: 'list',
                list: toneMappingOptions,
                value: getKeyByValue(toneMappingOptions, this.renderer.toneMapping),
                callback: value => {
                    this.renderer.toneMapping = toneMappingOptions[value];

                    this.scene.traverse(object => {
                        if (object.isMesh) {
                            object.material.needsUpdate = true;
                        }
                    });
                }
            },
            {
                type: 'slider',
                label: 'Exp',
                min: 0,
                max: 2,
                step: 0.01,
                value: this.renderer.toneMappingExposure,
                callback: value => {
                    this.renderer.toneMappingExposure = value;
                }
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
            }
        ];

        if (!Config.ORBIT) {
            items.push(
                {
                    type: 'divider'
                },
                {
                    type: 'slider',
                    label: 'Lerp',
                    min: 0,
                    max: 1,
                    step: 0.01,
                    value: CameraController.lerpSpeed,
                    callback: value => {
                        CameraController.lerpSpeed = value;
                    }
                }
            );
        }

        items.forEach(data => {
            this.ui.addPanel(new PanelItem(data));
        });
    }

    /**
     * Public methods
     */

    static setInvert = value => {
        const invert = brightness(value) > 0.6; // Light colour is inverted

        if (invert !== this.lastInvert) {
            this.lastInvert = invert;

            Stage.events.emit(Events.INVERT, { invert });
        }
    };

    static update = time => {
        if (!this.ui) {
            return;
        }

        Point3D.update(time);
        this.ui.update();
    };
}
