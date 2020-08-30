/**
 * @author pschroen / https://ufo.ai/
 */

import { PMREMGenerator } from 'three';

import { TextureLoader } from './TextureLoader.js';
import { Loader } from '../Loader.js';

export class EnvironmentTextureLoader extends Loader {
    constructor(renderer) {
        super();

        this.textureLoader = new TextureLoader();

        // Generates an environment diffuse texture
        this.pmremGenerator = new PMREMGenerator(renderer);
        this.pmremGenerator.compileEquirectangularShader();
    }

    load(path, callback) {
        this.textureLoader.load(path, texture => {
            const renderTargetCube = this.pmremGenerator.fromEquirectangular(texture);

            texture.dispose();

            if (callback) {
                callback(renderTargetCube.texture);
            }
        });
    }

    destroy() {
        this.pmremGenerator.dispose();
        this.textureLoader.destroy();

        return super.destroy();
    }
}
