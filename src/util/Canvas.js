/**
 * Canvas interface.
 *
 * @author Patrick Schroen / https://github.com/pschroen
 */

import { Interface } from './Interface';
import { Device } from './Device';

class Canvas extends Interface {

    constructor(name, w, h) {
        super(name, document.createElement('canvas'));
        this.context = this.element.getContext('2d');
        let ratio = Device.system.retina ? 2 : 1;
        this.element.width = w * ratio;
        this.element.height = h * ratio;
        this.size(w, h);
        this.context.scale(ratio, ratio);
    }

    toDataURL(type, quality) {
        return this.element.toDataURL(type, quality);
    }

    getImageData(x = 0, y = 0, w = this.width, h = this.height) {
        this.imageData = this.context.getImageData(x, y, w, h);
        return this.imageData;
    }

    getPixel(x, y, dirty) {
        if (!this.imageData || dirty) this.getImageData(0, 0, this.width, this.height);
        let imgData = {},
            index = (x + y * this.width) * 4,
            pixels = this.imageData.data;
        imgData.r = pixels[index];
        imgData.g = pixels[index + 1];
        imgData.b = pixels[index + 2];
        imgData.a = pixels[index + 3];
        return imgData;
    }
}

export { Canvas };
