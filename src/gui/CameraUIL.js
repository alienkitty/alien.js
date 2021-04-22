import { CameraController } from '../controllers/world/CameraController.js';
import { UIL } from '../utils/gui/UIL.js';

export class CameraUIL {
    static init() {
        const ui = new UIL('Camera');

        ui.addSlide(CameraController, 'lerpSpeed');

        ui.open();
    }
}
