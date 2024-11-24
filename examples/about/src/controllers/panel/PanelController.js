import { PanelItem } from '@alienkitty/space.js/three';

// import { FluidController } from '../world/FluidController.js';

export class PanelController {
    static init(ui) {
        this.ui = ui;

        this.initPanel();
    }

    static initPanel() {
        // const { passMaterial } = FluidController;

        const items = [
            {
                type: 'graph',
                name: 'FPS',
                noText: true,
                noHover: true
            },
            {
                type: 'graph',
                name: 'MS',
                range: 150,
                value: performance.now(),
                noHover: true,
                callback: (value, item) => {
                    const time = performance.now();
                    const ms = time - value;

                    item.update(ms);
                    item.setValue(ms);

                    return time;
                }
            }/* ,
            {
                type: 'slider',
                name: 'Viscosity',
                min: 0,
                max: 10,
                step: 0.1,
                value: passMaterial.uniforms.uDistortion.value,
                callback: value => {
                    passMaterial.uniforms.uDistortion.value = value;
                }
            } */
        ];

        items.forEach(data => {
            this.ui.addPanel(new PanelItem(data));
        });
    }
}
