/**
 * Image helper class with promise method.
 *
 * Currently no CORS support.
 *
 * @author Patrick Schroen / https://github.com/pschroen
 */

class Images {

    createImg(src, callback) {
        let img = new Image();
        img.src = src;
        img.onload = () => {
            img.complete = true;
            if (callback) callback();
        };
        return img;
    }

    promise(img) {
        let p = Promise.create();
        if (img.complete) return p.resolve();
        else img.onload = p.resolve;
        return p;
    }
}

export { Images };
