/**
 * @author pschroen / https://ufo.ai/
 */

import {
    LinearFilter,
    Mesh,
    NoBlending,
    OrthographicCamera,
    PlaneBufferGeometry,
    RawShaderMaterial,
    Scene,
    Texture,
    Uniform,
    WebGLRenderTarget,
    sRGBEncoding
} from 'three';

import vertexShader from '../../shaders/SpherizePass.vert.js';
import fragmentShader from '../../shaders/SpherizePass.frag.js';

export class SpherizeImage {
    constructor(renderer, direction) {
        this.renderer = renderer;

        this.scene = new Scene();
        this.camera = new OrthographicCamera(-1, 1, 1, -1, 0, 1);

        this.geometry = new PlaneBufferGeometry(1, 1);

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

        this.quad = new Mesh(this.geometry, this.material);
        this.scene.add(this.quad);

        this.output = new WebGLRenderTarget(1, 1, {
            depthBuffer: false
        });
    }

    setSize(width, height) {
        this.width = width;
        this.height = height;

        this.quad.scale.set(width, height, 1);

        this.camera.left = -width / 2;
        this.camera.right = width / 2;
        this.camera.top = height / 2;
        this.camera.bottom = -height / 2;
        this.camera.updateProjectionMatrix();

        this.output.setSize(width, height);
    }

    convert(image, options) {
        this.setSize(image.width, image.height);

        const texture = new Texture(image);
        texture.minFilter = LinearFilter;
        texture.encoding = sRGBEncoding;
        texture.generateMipmaps = false;
        texture.needsUpdate = true;

        this.quad.material.uniforms.tMap.value = texture;

        this.renderer.setRenderTarget(this.output);
        this.renderer.clear();
        this.renderer.render(this.scene, this.camera);
        this.renderer.setRenderTarget(null);

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
