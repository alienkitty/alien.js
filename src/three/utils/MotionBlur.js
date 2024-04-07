/**
 * @author pschroen / https://ufo.ai/
 *
 * Based on https://github.com/gkjohnson/threejs-sandbox/tree/master/motionBlurPass
 * Based on https://github.com/gkjohnson/threejs-sandbox/tree/master/shader-replacement
 */

import { HalfFloatType, Matrix4, WebGLRenderTarget } from 'three';

import { MotionBlurVelocityMaterial } from '../materials/MotionBlurVelocityMaterial.js';

export class MotionBlur {
    constructor(channel, {
        width = 256,
        height = 256,
        smearIntensity = 1
    } = {}) {
        this.channel = channel;

        this.smearIntensity = smearIntensity;

        this.prevProjectionMatrix = new Matrix4();
        this.prevMatrixWorldInverse = new Matrix4();

        this.initialized = false;
        this.enabled = true;

        // Render targets
        this.renderTarget = new WebGLRenderTarget(width, height, {
            type: HalfFloatType
        });
    }

    setSize(width, height) {
        this.renderTarget.setSize(width, height);
    }

    update(renderer, scene, camera, renderToScreen) {
        if (!this.enabled) {
            this.initialized = false;
            return;
        }

        // Renderer state
        const currentRenderTarget = renderer.getRenderTarget();
        const currentBackground = scene.background;

        // Velocity pass
        scene.background = null;

        if (!this.initialized) {
            this.prevProjectionMatrix.copy(camera.projectionMatrix);
            this.prevMatrixWorldInverse.copy(camera.matrixWorldInverse);
            this.initialized = true;
        }

        scene.traverseVisible(this.setVelocityMaterial);
        renderer.setRenderTarget(renderToScreen ? null : this.renderTarget);

        if (renderer.autoClear === false) {
            renderer.clear();
        }

        renderer.render(scene, camera);
        scene.traverseVisible(this.restoreOriginalMaterial);

        // Camera state for the next frame
        this.prevProjectionMatrix.copy(camera.projectionMatrix);
        this.prevMatrixWorldInverse.copy(camera.matrixWorldInverse);

        // Restore renderer settings
        scene.background = currentBackground;
        renderer.setRenderTarget(currentRenderTarget);
    }

    setVelocityMaterial = object => {
        if (object.layers.isEnabled(this.channel)) {
            if (!object.initialized) {
                object.prevMatrixWorld = object.matrixWorld.clone();
                object.originalMaterial = object.material;
                object.velocityMaterial = new MotionBlurVelocityMaterial();
                object.initialized = true;
            }

            object.velocityMaterial.uniforms.uPrevProjectionMatrix.value.copy(this.prevProjectionMatrix);
            object.velocityMaterial.uniforms.uPrevModelViewMatrix.value.multiplyMatrices(this.prevMatrixWorldInverse, object.prevMatrixWorld);
            object.velocityMaterial.uniforms.uIntensity.value = this.smearIntensity;
            object.material = object.velocityMaterial;

            // Current state for the next frame
            object.prevMatrixWorld.copy(object.matrixWorld);
        }
    };

    restoreOriginalMaterial = object => {
        if (object.layers.isEnabled(this.channel)) {
            object.material = object.originalMaterial;
        }
    };

    destroy() {
        this.renderTarget.dispose();

        for (const prop in this) {
            this[prop] = null;
        }

        return null;
    }
}