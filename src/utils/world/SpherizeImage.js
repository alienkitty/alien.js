/**
 * @author pschroen / https://ufo.ai/
 */

import {
    LinearFilter,
    Mesh,
    NoBlending,
    OrthographicCamera,
    RawShaderMaterial,
    Scene,
    Texture,
    Uniform,
    WebGLRenderTarget,
    sRGBEncoding
} from 'three';

import { getFullscreenTriangle } from './Utils3D.js';

import vertexShader from '../../shaders/SpherizePass.vert.js';
import fragmentShader from '../../shaders/SpherizePass.frag.js';

export class SpherizeImage {
    constructor(renderer, direction) {
        this.renderer = renderer;

        this.scene = new Scene();
        this.camera = new OrthographicCamera(-1, 1, 1, -1, 0, 1);

        this.geometry = getFullscreenTriangle();

        this.material = new RawShaderMaterial({
            uniforms: {
                tMap: new Uniform(null),
                uDirection: new Uniform(direction)
            },
            vertexShader,
            fragmentShader,
            blending: NoBlending,
            depthWrite: false,
            depthTest: false
        });

        this.screen = new Mesh(this.geometry, this.material);
        this.screen.frustumCulled = false;
        this.scene.add(this.screen);

        this.output = new WebGLRenderTarget(1, 1, {
            depthBuffer: false
        });
    }

    setSize(width, height) {
        this.width = width;
        this.height = height;

        this.output.setSize(width, height);
    }

    convert(image, options) {
        this.setSize(image.width, image.height);

        const texture = new Texture(image);
        texture.minFilter = LinearFilter;
        texture.encoding = sRGBEncoding;
        texture.generateMipmaps = false;
        texture.needsUpdate = true;

        this.material.uniforms.tMap.value = texture;

        const currentRenderTarget = this.renderer.getRenderTarget();

        this.renderer.setRenderTarget(this.output);

        if (this.renderer.autoClear === false) {
            this.renderer.clear();
        }

        this.renderer.render(this.scene, this.camera);

        this.renderer.setRenderTarget(currentRenderTarget);

        texture.dispose();

        const pixels = new Uint8Array(this.width * this.height * 4);
        this.renderer.readRenderTargetPixels(this.output, 0, 0, this.width, this.height, pixels);

        const imageData = new ImageData(new Uint8ClampedArray(pixels), this.width, this.height);

        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');

        canvas.width = options.double ? this.width * 2 : this.width;
        canvas.height = this.height;
        context.putImageData(imageData, 0, 0);

        if (options.double) {
            context.putImageData(imageData, this.width, 0);
        }

        return canvas;
    }

    destroy() {
        this.output.dispose();
        this.material.dispose();
        this.geometry.dispose();

        for (const prop in this) {
            this[prop] = null;
        }

        return null;
    }
}
