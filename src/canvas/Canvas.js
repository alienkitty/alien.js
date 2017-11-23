/**
 * Canvas interface.
 *
 * @author Patrick Schroen / https://github.com/pschroen
 */

import { Render } from '../util/Render';
import { Utils } from '../util/Utils';
import { Interface } from '../util/Interface';

class Canvas {

    constructor(w, h = w, retina) {
        this.element = document.createElement('canvas');
        this.context = this.element.getContext('2d');
        this.object = new Interface(this.element);
        this.children = [];
        this.retina = retina;
        this.size(w, h, retina);
    }

    size(w, h, retina) {
        let ratio = retina ? 2 : 1;
        this.element.width = w * ratio;
        this.element.height = h * ratio;
        this.width = w;
        this.height = h;
        this.scale = ratio;
        this.object.size(this.width, this.height);
        this.context.scale(ratio, ratio);
        this.element.style.width = w + 'px';
        this.element.style.height = h + 'px';
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

    add(child) {
        child.setCanvas(this);
        child.parent = this;
        this.children.push(child);
        child.z = this.children.length;
    }

    remove(child) {
        child.canvas = null;
        child.parent = null;
        this.children.remove(child);
    }

    destroy() {
        for (let i = 0; i < this.children.length; i++) this.children[i].destroy();
        this.object.destroy();
        return Utils.nullObject(this);
    }

    startRender() {
        Render.start(this.render);
    }

    stopRender() {
        Render.stop(this.render);
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
