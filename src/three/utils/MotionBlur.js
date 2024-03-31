/**
 * @author pschroen / https://ufo.ai/
 *
 * Based on https://github.com/gkjohnson/threejs-sandbox/tree/master/motionBlurPass
 * Based on https://github.com/gkjohnson/threejs-sandbox/tree/master/shader-replacement
 */

import { HalfFloatType, Matrix4, Mesh, WebGLRenderTarget } from 'three';

import { MotionBlurVelocityMaterial } from '../materials/MotionBlurVelocityMaterial.js';

export class MotionBlur {
    constructor({
        width = 256,
        height = 256,
        smearIntensity = 1
    } = {}) {
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

    update(renderer, scene, camera) {
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

        scene.traverse(this.setVelocityMaterial);
        renderer.setRenderTarget(this.renderTarget);

        if (renderer.autoClear === false) {
            renderer.clear();
        }

        renderer.render(scene, camera);
        scene.traverse(this.restoreOriginalMaterial);

        // Camera state for the next frame
        this.prevProjectionMatrix.copy(camera.projectionMatrix);
        this.prevMatrixWorldInverse.copy(camera.matrixWorldInverse);

        // Restore renderer settings
        scene.background = currentBackground;
        renderer.setRenderTarget(currentRenderTarget);
    }

    setVelocityMaterial = object => {
        if (object.isMotionBlurMesh) {
            object.material = object.velocityMaterial;

            if (!object.initialized) {
                object.prevMatrixWorld.copy(object.matrixWorld);
                object.initialized = true;
            }

            object.velocityMaterial.uniforms.uPrevProjectionMatrix.value.copy(this.prevProjectionMatrix);
            object.velocityMaterial.uniforms.uPrevModelViewMatrix.value.multiplyMatrices(this.prevMatrixWorldInverse, object.prevMatrixWorld);
            object.velocityMaterial.uniforms.uIntensity.value = this.smearIntensity;

            // Current state for the next frame
            object.prevMatrixWorld.copy(object.matrixWorld);
        }
    };

    restoreOriginalMaterial = object => {
        if (object.isMotionBlurMesh) {
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

export class MotionBlurMesh extends Mesh {
    constructor(geometry, material, channel) {
        super(geometry, material);

        this.isMotionBlurMesh = true;

        this.prevMatrixWorld = new Matrix4();

        this.channel = channel;

        this.initialized = false;

        this.originalMaterial = material;
        this.velocityMaterial = new MotionBlurVelocityMaterial();

        this.layers.enable(channel);
    }

    dispose() {
        this.initialized = false;

        this.originalMaterial = null;
        this.velocityMaterial.dispose();
    }
}
