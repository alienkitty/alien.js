import { Config } from '../../config/Config.js';
import { Events } from '../../config/Events.js';
import { Point3D } from '../../utils/ui/Point3D.js';
import { MaterialPanelController } from '../../utils/panel/MaterialPanelController.js';
import { CameraController } from '../world/CameraController.js';

export class ScenePanelController {
    static init(view) {
        this.view = view;

        this.points = [];

        this.initPanel();

        this.addListeners();
    }

    static initPanel() {
        const views = [this.view];

        views.forEach(view => {
            const { material } = view.mesh;

            view.point = new Point3D(view.mesh, {
                name: material.name,
                type: material.type
            });
            view.add(view.point);
            this.points.push(view.point);

            MaterialPanelController.init(view.point, material);
        });
    }

    static addListeners() {
        Point3D.add(...this.points);
        Point3D.events.on(Events.SELECT, this.onSelect);
    }

    /**
     * Event handlers
     */

    static onSelect = ({ selected }) => {
        if (Config.ORBIT) {
            return;
        }

        if (selected.length) {
            CameraController.enabled = false;
        } else {
            CameraController.enabled = true;
        }
    };
}
