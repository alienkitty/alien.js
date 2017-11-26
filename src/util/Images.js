/**
 * Image helper class with promise method.
 *
 * @author Patrick Schroen / https://github.com/pschroen
 */

class Images {

    constructor() {
        this.CORS = null;
    }

    createImg(src, callback) {
        let img = new Image();
        img.crossOrigin = this.CORS;
        img.src = src;
        img.onload = callback;
        img.onerror = callback;
        return img;
    }

    promise(img) {
        let promise = Promise.create();
        img.onload = promise.resolve;
        img.onerror = promise.resolve;
        return promise;
    }
}

export { Images };
