/**
 * @author pschroen / https://ufo.ai/
 */

import { PanelItem } from './PanelItem.js';

import { getKeyByValue } from '../Utils.js';

export class MaterialPanelController {
    static init(ui, material) {
        this.ui = ui;
        this.material = material;

        this.initPanel();
    }

    static initPanel() {
        const material = this.material;

        const flatShadingOptions = {
            Off: false,
            Flat: true
        };

        const wireframeOptions = {
            Off: false,
            Wire: true
        };

        const items = [
            {
                type: 'divider'
            },
            {
                type: 'color',
                value: material.color,
                callback: value => {
                    material.color.copy(value);
                }
            },
            {
                type: 'color',
                value: material.emissive,
                callback: value => {
                    material.emissive.copy(value);
                }
            },
            {
                type: 'slider',
                label: 'Rough',
                min: 0,
                max: 2,
                step: 0.01,
                value: material.roughness,
                callback: value => {
                    material.roughness = value;
                }
            },
            {
                type: 'slider',
                label: 'Metal',
                min: 0,
                max: 2,
                step: 0.01,
                value: material.metalness,
                callback: value => {
                    material.metalness = value;
                }
            },
            {
                type: 'list',
                list: flatShadingOptions,
                value: getKeyByValue(flatShadingOptions, material.flatShading),
                callback: value => {
                    material.flatShading = flatShadingOptions[value];
                    material.needsUpdate = true;
                }
            },
            {
                type: 'list',
                list: wireframeOptions,
                value: getKeyByValue(wireframeOptions, material.wireframe),
                callback: value => {
                    material.wireframe = wireframeOptions[value];
                }
            },
            // TODO: Texture thumbnails
            {
                type: 'slider',
                label: 'Env Int',
                min: 0,
                max: 2,
                step: 0.01,
                value: material.envMapIntensity,
                callback: value => {
                    material.envMapIntensity = value;
                }
            }
        ];

        items.forEach(data => {
            const item = new PanelItem(data);
            this.ui.addPanel(item);
        });
    }
}
