/**
 * @author pschroen / https://ufo.ai/
 *
 * Based on https://oframe.github.io/ogl/examples/?src=mouse-flowmap.html by gordonnl
 */

import {
    HalfFloatType,
    Mesh,
    OrthographicCamera,
    RawShaderMaterial,
    Scene,
    Uniform,
    Vector2,
    WebGLRenderTarget
} from 'three';

import { getFullscreenTriangle } from './Utils3D.js';

import vertexShader from '../../shaders/FlowmapPass.vert.js';
import fragmentShader from '../../shaders/FlowmapPass.frag.js';

export class Flowmap {
    constructor(renderer, {
        size = 128,
        falloff = 0.15,
        alpha = 1,
        dissipation = 0.98
    } = {}) {
        this.renderer = renderer;

        this.mouse = new Vector2();
        this.velocity = new Vector2();

        // Render targets
        this.renderTargetRead = new WebGLRenderTarget(size, size, {
            type: HalfFloatType,
            depthBuffer: false
        });

        this.renderTargetWrite = this.renderTargetRead.clone();

        // Output uniform containing render target textures
        this.uniform = new Uniform(this.renderTargetRead.texture);

        // Flowmap material
        this.material = new RawShaderMaterial({
            uniforms: {
                tMap: this.uniform,

                uFalloff: new Uniform(falloff),
                uAlpha: new Uniform(alpha),
                uDissipation: new Uniform(dissipation),

                // User needs to update these
                uAspect: new Uniform(1),
                uMouse: new Uniform(this.mouse),
                uVelocity: new Uniform(this.velocity)
            },
            vertexShader,
            fragmentShader,
            depthTest: false
        });

        // Fullscreen triangle
        this.screenScene = new Scene();
        this.screenCamera = new OrthographicCamera(-1, 1, 1, -1, 0, 1);

        this.screenGeometry = getFullscreenTriangle();

        this.screen = new Mesh(this.screenGeometry, this.material);
        this.screen.frustumCulled = false;
        this.screenScene.add(this.screen);
    }

    update() {
        const currentRenderTarget = this.renderer.getRenderTarget();

        const currentAutoClear = this.renderer.autoClear;
        this.renderer.autoClear = false;

        this.renderer.setRenderTarget(this.renderTargetWrite);
        this.renderer.render(this.screenScene, this.screenCamera);

        // Swap render targets
        const temp = this.renderTargetRead;
        this.renderTargetRead = this.renderTargetWrite;
        this.renderTargetWrite = temp;

        this.uniform.value = this.renderTargetRead.texture;

        // Restore renderer settings
        this.renderer.autoClear = currentAutoClear;

        this.renderer.setRenderTarget(currentRenderTarget);
    }

    destroy() {
        this.renderTargetWrite.dispose();
        this.renderTargetRead.dispose();
        this.material.dispose();
        this.screenGeometry.dispose();

        for (const prop in this) {
            this[prop] = null;
        }

        return null;
    }
}
