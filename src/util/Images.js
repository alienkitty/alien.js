/**
 * Image helper class.
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
            this.complete = true;
            if (callback) callback();
        };
        return img;
    }
}

export { Images };
