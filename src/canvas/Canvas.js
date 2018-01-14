/**
 * Canvas interface.
 *
 * @author Patrick Schroen / https://github.com/pschroen
 */

import { Utils } from '../util/Utils';
import { Interface } from '../util/Interface';
import { CanvasGraphics } from './CanvasGraphics';

class Canvas {

    constructor(w, h = w, retina, whiteAlpha) {
        const self = this;
        this.element = document.createElement('canvas');
        this.context = this.element.getContext('2d');
        this.object = new Interface(this.element);
        this.children = [];
        this.retina = retina;

        size(w, h, retina);

        function size(w, h, retina) {
            const ratio = retina ? 2 : 1;
            self.element.width = w * ratio;
            self.element.height = h * ratio;
            self.width = w;
            self.height = h;
            self.scale = ratio;
            self.object.size(self.width, self.height);
            self.context.scale(ratio, ratio);
            self.element.style.width = w + 'px';
            self.element.style.height = h + 'px';
            if (whiteAlpha) {
                const alpha = new CanvasGraphics(self.width, self.height);
                alpha.fillStyle = 'rgba(255, 255, 255, 0.002)';
                alpha.fillRect(0, 0, self.width, self.height);
                alpha.setCanvas(self);
                alpha.parent = self;
                self.children[0] = alpha;
                alpha.z = 1;
            }
        }

        this.size = size;

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

        this.add = child => {
            child.setCanvas(this);
            child.parent = this;
            this.children.push(child);
            child.z = this.children.length;
        };

        this.remove = child => {
            child.canvas = null;
            child.parent = null;
            this.children.remove(child);
        };

        this.destroy = () => {
            for (let i = this.children.length - 1; i >= 0; i--) this.children[i].destroy();
            this.object.destroy();
            return Utils.nullObject(this);
        };

        this.getImageData = (x = 0, y = 0, w = this.element.width, h = this.element.height) => {
            this.imageData = this.context.getImageData(x, y, w, h);
            return this.imageData;
        };

        this.getPixel = (x, y, dirty) => {
            if (!this.imageData || dirty) this.getImageData();
            const imgData = {},
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
