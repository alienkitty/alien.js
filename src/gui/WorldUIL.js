import { ACESFilmicToneMapping, CineonToneMapping, LinearToneMapping, NoToneMapping, ReinhardToneMapping } from 'three';

import { WorldController } from '../controllers/world/WorldController.js';
import { UIL } from '../utils/gui/UIL.js';

export class WorldUIL {
    static init() {
        const { renderer, scene } = WorldController;

        const ui = new UIL('Background');

        ui.addColor('color', scene, 'background');

        ui.open();

        // https://threejs.org/examples/#webgl_tonemapping

        const params = {
            exposure: 1.0,
            toneMapping: 'ACESFilmic'
        };

        const toneMappingOptions = {
            None: NoToneMapping,
            Linear: LinearToneMapping,
            Reinhard: ReinhardToneMapping,
            Cineon: CineonToneMapping,
            ACESFilmic: ACESFilmicToneMapping
        };

        const toneMapping = new UIL('Tone Mapping');

        const list = toneMapping.addList(Object.keys(toneMappingOptions), params, 'toneMapping', () => {
            renderer.toneMapping = toneMappingOptions[params.toneMapping];
            scene.traverse(object => {
                if (object.isMesh) {
                    object.material.needsUpdate = true;
                }
            });
        });
        list.text(params.toneMapping);

        toneMapping.addSlide('exposure', renderer, 'toneMappingExposure', 0, 2);

        toneMapping.open();
    }
}
