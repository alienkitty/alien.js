/**
 * Image helper class with promise method.
 *
 * Currently no CORS support.
 *
 * @author Patrick Schroen / https://github.com/pschroen
 */

let Images = new ( // Singleton pattern

class Images {

    createImg(src, callback) {
        let img = new Image();
        img.src = src;
        img.onload = () => {
            if (callback) callback();
        };
        return img;
    }

    promise(img) {
        let p = Promise.create();
        img.onload = p.resolve;
        return p;
    }
}

)(); // Singleton pattern

export { Images };
