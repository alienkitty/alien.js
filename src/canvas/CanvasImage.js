/**
 * Canvas with a single image.
 *
 * @author Patrick Schroen / https://github.com/pschroen
 */

import { CanvasGraphics } from './CanvasGraphics';
import { Canvas } from './Canvas';

class CanvasImage extends CanvasGraphics {

    constructor(parent, name, w, h = w) {
        super(w, h);
        let canvas = parent.initClass(Canvas, name, w, h);

        this.img = src => {
            this.drawImage(src, 0, 0, w, h);
            canvas.add(this);
            return this;
        };
    }
}

export { CanvasImage };
