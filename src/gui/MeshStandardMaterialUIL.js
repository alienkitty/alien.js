import { UIL } from '../utils/gui/UIL.js';

export class MeshStandardMaterialUIL {
    static init(name, view) {
        const { material } = view;

        const ui = new UIL(name);

        ui.addColor(material, 'color');
        ui.addColor(material, 'emissive');

        ui.addSlide(material, 'roughness');
        ui.addSlide(material, 'metalness');

        ui.addBool(material, 'flatShading', () => {
            material.needsUpdate = true;
        });

        ui.addBool(material, 'wireframe');

        // TODO: Image

        ui.addSlide(material, 'envMapIntensity');

        ui.open();
    }
}
