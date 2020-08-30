/**
 * @author pschroen / https://ufo.ai/
 */

import { Vector2 } from 'three';

import { SpherizeImage } from '../../utils/world/SpherizeImage.js';
import { TextureLoader } from './TextureLoader.js';
import { Loader } from '../Loader.js';

export class SpherizeTextureLoader extends Loader {
    static RADIAL = new Vector2(1, 1);
    static HORIZONTAL = new Vector2(1, 0);
    static VERTICAL = new Vector2(0, 1);
    static NONE = new Vector2(0, 0);

    constructor(renderer, direction = SpherizeTextureLoader.RADIAL) {
        super();

        this.spherize = new SpherizeImage(renderer, direction);

        this.textureLoader = new TextureLoader();
        this.textureLoader.setOptions({
            imageOrientation: 'none'
        });

        this.defaultOptions = {
            double: false
        };

        this.options = this.defaultOptions;
    }

    load(path, callback) {
        return this.textureLoader.load(path, texture => {
            texture.image = this.spherize.convert(texture.image, this.options);
            texture.needsUpdate = true;

            if (callback) {
                callback(texture);
            }
        });
    }

    setOptions(options) {
        this.options = Object.assign(this.defaultOptions, options);

        return this;
    }

    destroy() {
        this.textureLoader.destroy();
        this.spherize.destroy();

        return super.destroy();
    }
}
