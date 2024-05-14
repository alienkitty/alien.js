/**
 * @author pschroen / https://ufo.ai/
 *
 * Based on https://github.com/gkjohnson/threejs-sandbox/tree/master/motionBlurPass
 * Based on https://github.com/gkjohnson/threejs-sandbox/tree/master/shader-replacement
 */

import { Color, HalfFloatType, InstancedBufferAttribute, Matrix4, WebGLRenderTarget } from 'three';

import { MotionBlurVelocityMaterial } from '../materials/MotionBlurVelocityMaterial.js';

export class MotionBlur {
    constructor(renderer, scene, camera, channel, {
        width = 256,
        height = 256,
        interpolateGeometry = 1,
        smearIntensity = 1,
        cameraBlur = true
    } = {}) {
        this.renderer = renderer;
        this.scene = scene;
        this.camera = camera;
        this.channel = channel;

        this.interpolateGeometry = interpolateGeometry;
        this.smearIntensity = smearIntensity;
        this.cameraBlur = cameraBlur;

        this.prevProjectionMatrix = new Matrix4();
        this.prevMatrixWorldInverse = new Matrix4();

        this.initialized = false;
        this.enabled = true;
        this.saveState = true;

        // Clear colors
        this.clearColor = new Color(0, 0, 0);
        this.currentClearColor = new Color();

        // Render targets
        this.renderTarget = new WebGLRenderTarget(width, height, {
            type: HalfFloatType
        });
    }

    setSize(width, height) {
        this.renderTarget.setSize(width, height);
    }

    update(renderTarget = this.renderTarget) {
        if (!this.enabled) {
            this.initialized = false;
            return;
        }

        if (!this.initialized) {
            this.prevProjectionMatrix.copy(this.camera.projectionMatrix);
            this.prevMatrixWorldInverse.copy(this.camera.matrixWorldInverse);
            this.initialized = true;
        }

        // Renderer state
        const currentRenderTarget = this.renderer.getRenderTarget();
        const currentBackground = this.scene.background;
        this.renderer.getClearColor(this.currentClearColor);
        const currentClearAlpha = this.renderer.getClearAlpha();

        // Velocity pass
        this.scene.background = null;
        this.renderer.setClearColor(this.clearColor, 1);

        this.scene.traverseVisible(this.setVelocityMaterial);
        this.renderer.setRenderTarget(renderTarget);

        if (this.renderer.autoClear === false) {
            this.renderer.clear();
        }

        this.renderer.render(this.scene, this.camera);
        this.scene.traverseVisible(this.restoreOriginalMaterial);

        // Camera state for the next frame
        this.prevProjectionMatrix.copy(this.camera.projectionMatrix);
        this.prevMatrixWorldInverse.copy(this.camera.matrixWorldInverse);

        // Restore renderer settings
        this.scene.background = currentBackground;
        this.renderer.setClearColor(this.currentClearColor, currentClearAlpha);
        this.renderer.setRenderTarget(currentRenderTarget);
    }

    setVelocityMaterial = object => {
        if (object.layers.isEnabled(this.channel)) {
            if (!object.initialized) {
                object.prevMatrixWorld = object.matrixWorld.clone();
                object.originalMaterial = object.material;

                if (object.isInstancedMesh) {
                    object.prevInstanceMatrix = new InstancedBufferAttribute(new Float32Array(object.instanceMatrix.array), 16);
                    object.geometry.setAttribute('instancePrevMatrix', object.prevInstanceMatrix);
                    object.velocityMaterial = new MotionBlurVelocityMaterial({ instancing: true });
                } else {
                    object.velocityMaterial = new MotionBlurVelocityMaterial();
                }

                object.initialized = true;
            }

            object.velocityMaterial.uniforms.uPrevProjectionMatrix.value.copy(this.cameraBlur ? this.prevProjectionMatrix : this.camera.projectionMatrix);
            object.velocityMaterial.uniforms.uPrevModelViewMatrix.value.multiplyMatrices(this.cameraBlur ? this.prevMatrixWorldInverse : this.camera.matrixWorldInverse, object.prevMatrixWorld);
            object.velocityMaterial.uniforms.uInterpolateGeometry.value = this.interpolateGeometry;
            object.velocityMaterial.uniforms.uIntensity.value = this.smearIntensity;
            object.material = object.velocityMaterial;
        }
    };

    restoreOriginalMaterial = object => {
        if (object.layers.isEnabled(this.channel)) {
            object.material = object.originalMaterial;

            // Current state for the next frame
            if (this.saveState) {
                object.prevMatrixWorld.copy(object.matrixWorld);

                if (object.isInstancedMesh) {
                    object.prevInstanceMatrix.copyArray(object.instanceMatrix.array);
                    object.prevInstanceMatrix.needsUpdate = true;
                }
            }
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
