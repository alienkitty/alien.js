/**
 * Image helper class with promise method.
 *
 * @author Patrick Schroen / https://github.com/pschroen
 */

class Assets {

    constructor() {
        this.CDN = '';
        this.CORS = null;
        const images = {};

        this.createImage = (src, store, callback) => {
            if (typeof store !== 'boolean') callback = store;
            const img = new Image();
            img.crossOrigin = this.CORS;
            img.src = src;
            img.onload = callback;
            img.onerror = callback;
            if (store) images[src] = img;
            return img;
        };

        this.getImage = src => {
            return images[src];
        };
    }

    loadImage(img) {
        if (typeof img === 'string') img = this.createImage(img);
        const promise = Promise.create();
        img.onload = promise.resolve;
        img.onerror = promise.resolve;
        return promise;
    }
}

export { Assets };
