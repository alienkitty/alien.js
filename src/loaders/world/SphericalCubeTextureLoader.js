/**
 * @author pschroen / https://ufo.ai/
 */

import { NearestFilter, Texture, WebGLCubeRenderTarget } from 'three';

import { SpherizeTextureLoader } from './SpherizeTextureLoader.js';
import { Loader } from '../Loader.js';

export class SphericalCubeTextureLoader extends Loader {
    constructor(renderer, double = false) {
        super();

        this.renderer = renderer;

        // Simulates an equirectangular image
        this.textureLoader = new SpherizeTextureLoader(renderer, SpherizeTextureLoader.VERTICAL);
        this.textureLoader.setOptions({
            double
        });

        this.defaultOptions = {
            size: 1024
        };

        this.options = this.defaultOptions;
    }

    load(path, callback) {
        const textures = [];

        for (let faceIndex = 0; faceIndex < 6; faceIndex++) {
            textures[faceIndex] = new Texture();
        }

        this.textureLoader.load(path, texture => {
            // Nearest filter to prevent polar pinch
            texture.magFilter = NearestFilter;
            texture.minFilter = NearestFilter;

            const options = {
                depthBuffer: false
            };

            const renderTargetCube = new WebGLCubeRenderTarget(this.options.size, options).fromEquirectangularTexture(this.renderer, texture);

            texture.dispose();

            const imageWidth = renderTargetCube.width;

            for (let faceIndex = 0; faceIndex < 6; faceIndex++) {
                const pixels = new Uint8Array(imageWidth * imageWidth * 4);
                this.renderer.readRenderTargetPixels(renderTargetCube, 0, 0, imageWidth, imageWidth, pixels, faceIndex);

                const imageData = new ImageData(new Uint8ClampedArray(pixels), imageWidth, imageWidth);

                const canvas = document.createElement('canvas');
                const context = canvas.getContext('2d');

                canvas.width = imageWidth;
                canvas.height = imageWidth;
                context.putImageData(imageData, 0, 0);

                const faceTexture = textures[faceIndex];
                faceTexture.image = canvas;
                faceTexture.needsUpdate = true;
            }

            renderTargetCube.dispose();

            if (callback) {
                callback(textures);
            }
        });

        return textures;
    }

    setOptions(options) {
        this.options = Object.assign(this.defaultOptions, options);

        return this;
    }

    destroy() {
        this.textureLoader.destroy();

        return super.destroy();
    }
}
