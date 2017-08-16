/**
 * Canvas interface.
 *
 * @author Patrick Schroen / https://github.com/pschroen
 */

import { Interface } from '../util/Interface';

class Canvas {

    constructor(name, w, h = w, retina) {
        let canvas = new Interface(name, 'canvas', true);
        this.element = canvas.element;
        this.context = this.element.getContext('2d');
        this.children = [];
        this.retina = retina;
        let ratio = retina ? 2 : 1;
        this.element.width = w * ratio;
        this.element.height = h * ratio;
        this.context.scale(ratio, ratio);
        canvas.size(w, h);

        this.toDataURL = (type, quality) => {
            return this.element.toDataURL(type, quality);
        };

        this.render = noClear => {
            if (!(typeof noClear === 'boolean' && noClear)) this.clear();
            for (let i = 0; i < this.children.length; i++) this.children[i].render();
        };

        this.clear = () => {
            this.context.clearRect(0, 0, this.element.width, this.element.height);
        };

        this.add = display => {
            display.setCanvas(this);
            display.parent = this;
            this.children.push(display);
            display.z = this.children.length;
        };

        this.remove = display => {
            display.canvas = null;
            display.parent = null;
            let i = this.children.indexOf(display);
            if (i > -1) this.children.splice(i, 1);
        };

        this.destroy = () => {
            for (let i = 0; i < this.children.length; i++) this.children[i].destroy();
            return canvas = canvas.destroy();
        };

        this.getImageData = (x = 0, y = 0, w = this.element.width, h = this.element.height) => {
            this.imageData = this.context.getImageData(x, y, w, h);
            return this.imageData;
        };

        this.getPixel = (x, y, dirty) => {
            if (!this.imageData || dirty) this.getImageData();
            let imgData = {},
                index = (x + y * this.element.width) * 4,
                pixels = this.imageData.data;
            imgData.r = pixels[index];
            imgData.g = pixels[index + 1];
            imgData.b = pixels[index + 2];
            imgData.a = pixels[index + 3];
            return imgData;
        };

        this.putImageData = imageData => {
            this.context.putImageData(imageData, 0, 0);
        };
    }
}

export { Canvas };
