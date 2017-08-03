/**
 * Canvas interface.
 *
 * @author Patrick Schroen / https://github.com/pschroen
 */

import { Interface } from '../util/Interface';

class Canvas extends Interface {

    constructor(name, w, h = w, retina) {
        super(name, 'canvas', true);
        this.children = [];
        this.retina = retina;
        this.context = this.element.getContext('2d');
        let ratio = retina ? 2 : 1;
        this.element.width = w * ratio;
        this.element.height = h * ratio;
        this.context.scale(ratio, ratio);
        this.size(w, h);
    }

    toDataURL(type, quality) {
        return this.element.toDataURL(type, quality);
    }

    render(noClear) {
        if (!(typeof noClear === 'boolean' && noClear)) this.clear();
        for (let i = 0; i < this.children.length; i++) this.children[i].render();
    }

    clear() {
        this.context.clearRect(0, 0, this.element.width, this.element.height);
    }

    add(display) {
        display.setCanvas(this);
        display.parent = this;
        this.children.push(display);
        display.z = this.children.length;
    }

    remove(display) {
        display.canvas = null;
        display.parent = null;
        let i = this.children.indexOf(display);
        if (i > -1) this.children.splice(i, 1);
    }

    destroy() {
        for (let i = 0; i < this.children.length; i++) this.children[i].destroy();
        return super.destroy();
    }

    getImageData(x = 0, y = 0, w = this.element.width, h = this.element.height) {
        this.imageData = this.context.getImageData(x, y, w, h);
        return this.imageData;
    }

    getPixel(x, y, dirty) {
        if (!this.imageData || dirty) this.getImageData();
        let imgData = {},
            index = (x + y * this.element.width) * 4,
            pixels = this.imageData.data;
        imgData.r = pixels[index];
        imgData.g = pixels[index + 1];
        imgData.b = pixels[index + 2];
        imgData.a = pixels[index + 3];
        return imgData;
    }

    putImageData(imageData) {
        this.context.putImageData(imageData, 0, 0);
    }
}

export { Canvas };
