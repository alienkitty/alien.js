/**
 * @author pschroen / https://ufo.ai/
 *
 * Based on https://github.com/gkjohnson/threejs-sandbox/tree/master/motionBlurPass
 */

import { Color, Frustum, HalfFloatType, Matrix4, Mesh, OrthographicCamera, WebGLRenderTarget } from 'three';

import { MotionBlurVelocityMaterial } from '../materials/MotionBlurVelocityMaterial.js';
import { MotionBlurCompositeMaterial } from '../materials/MotionBlurCompositeMaterial.js';

import { getFullscreenTriangle } from '@alienkitty/space.js/three';

export class MotionBlur {
    constructor(renderer, scene, camera, {
        samples = 15,
        expandGeometry = 0,
        interpolateGeometry = 1,
        smearIntensity = 1,
        blurTransparent = false,
        renderCameraBlur = true,
        renderTargetScale = 1
    } = {}) {
        this.renderer = renderer;
        this.scene = scene;
        this.camera = camera;

        this.samples = samples;
        this.expandGeometry = expandGeometry;
        this.interpolateGeometry = interpolateGeometry;
        this.smearIntensity = smearIntensity;
        this.blurTransparent = blurTransparent;
        this.renderCameraBlur = renderCameraBlur;
        this.renderTargetScale = renderTargetScale;

        this.enabled = true;

        // Positions for the previous frame
        this.prevPosMap = new Map();
        this.currentFrameMod = 0;
        this.defaultOverrides = {};
        this.frustum = new Frustum();
        this.projScreenMatrix = new Matrix4();
        this.cameraMatricesNeedInitializing = true;

        this.prevCamProjection = new Matrix4();
        this.prevCamWorldInverse = new Matrix4();

        // Clear colors
        this.clearColor = new Color(0, 0, 0);
        this.currentClearColor = new Color();

        // Render targets
        this.renderTarget = new WebGLRenderTarget(256, 256, {
            type: HalfFloatType
        });

        // Composite material
        this.compositeMaterial = new MotionBlurCompositeMaterial();
        this.compositeMaterial.defines.SAMPLES = this.samples;
        this.compositeMaterial.uniforms.velocityBuffer.value = this.renderTarget.texture;

        // Fullscreen triangle
        this.screenCamera = new OrthographicCamera(-1, 1, 1, -1, 0, 1);
        this.screenTriangle = getFullscreenTriangle();
        this.screen = new Mesh(this.screenTriangle, this.compositeMaterial);
        this.screen.frustumCulled = false;
    }

    setSize(width, height) {
        this.renderTarget.setSize(width * this.renderTargetScale, height * this.renderTargetScale);
    }

    update() {
        if (!this.enabled) {
            if (!this.cameraMatricesNeedInitializing) {
                this.prevPosMap.clear();
                this.cameraMatricesNeedInitializing = true;
            }

            return;
        }

        // Renderer state
        const currentRenderTarget = this.renderer.getRenderTarget();
        this.renderer.getClearColor(this.currentClearColor);
        const currentClearAlpha = this.renderer.getClearAlpha();
        const currentAutoClear = this.renderer.autoClear;
        this.renderer.autoClear = false;

        this.renderer.setClearColor(this.clearColor, 0);

        this.ensurePrevCameraTransform();

        this.renderer.setRenderTarget(this.renderTarget);
        this.renderer.clear();
        this.drawAllMeshes();

        this.compositeMaterial.uniforms.sourceBuffer.value = readBuffer.texture;
        this.renderer.setRenderTarget(writeBuffer);
        this.renderer.render(this.screen, this.screenCamera);

        // Camera state for the next frame
        this.prevCamProjection.copy(this.camera.projectionMatrix);
        this.prevCamWorldInverse.copy(this.camera.matrixWorldInverse);

        // Restore renderer settings
        this.renderer.setClearColor(this.currentClearColor, currentClearAlpha);
        this.renderer.autoClear = currentAutoClear;
        this.renderer.setRenderTarget(currentRenderTarget);
    }

    // Returns the previous frame's data for object position
    // Creates a new object with the frame's state if it hasn't been created yet
    getPreviousFrameState(object) {
        let data = this.prevPosMap.get(object);

        if (data === undefined) {
            data = {
                lastUsedFrame: -1,
                matrixWorld: object.matrixWorld.clone(),
                velocityMaterial: new MotionBlurVelocityMaterial()
            };

            this.prevPosMap.set(object, data);
        }

        return data;
    }

    // Saves the current state for the next frame
    saveCurrentObjectState(object) {
        const data = this.prevPosMap.get(object);

        data.matrixWorld.copy(object.matrixWorld);
    }

    // Draw all meshes in the scene and discard those that are no longer being used
    drawAllMeshes() {
        this.currentFrameMod = (this.currentFrameMod + 1) % 2;

        const thisFrameId = this.currentFrameMod;

        this.scene.traverse(object => {
            if (object.visible && object.isMesh) {
                this.drawMesh(object);

                if (this.prevPosMap.has(object)) {
                    const data = this.prevPosMap.get(object);

                    data.lastUsedFrame = thisFrameId;
                }
            }
        });

        this.prevPosMap.forEach((data, mesh) => {
            if (data.lastUsedFrame !== thisFrameId) {
                data.velocityMaterial.dispose();

                this.prevPosMap.delete(mesh);
            }
        });
    }

    drawMesh(mesh) {
        const overrides = mesh.motionBlur || this.defaultOverrides;

        const blurTransparent = overrides.blurTransparent !== undefined ? overrides.blurTransparent : this.blurTransparent;
        const renderCameraBlur = overrides.renderCameraBlur !== undefined ? overrides.renderCameraBlur : this.renderCameraBlur;
        const expandGeometry = overrides.expandGeometry !== undefined ? overrides.expandGeometry : this.expandGeometry;
        const interpolateGeometry = overrides.interpolateGeometry !== undefined ? overrides.interpolateGeometry : this.interpolateGeometry;
        const smearIntensity = overrides.smearIntensity !== undefined ? overrides.smearIntensity : this.smearIntensity;

        const isTransparent = mesh.material.transparent || mesh.material.alpha < 1;
        const isCulled = mesh.frustumCulled && !this.frustum.intersectsObject(mesh);
        const skip = blurTransparent === false && isTransparent || isCulled;

        if (skip) {
            if (this.prevPosMap.has(mesh)) {
                this.saveCurrentObjectState(mesh);
            }
        } else {
            const projMat = renderCameraBlur ? this.prevCamProjection : this.camera.projectionMatrix;
            const invMat = renderCameraBlur ? this.prevCamWorldInverse : this.camera.matrixWorldInverse;
            const data = this.getPreviousFrameState(mesh);

            data.velocityMaterial.uniforms.expandGeometry.value = expandGeometry;
            data.velocityMaterial.uniforms.interpolateGeometry.value = interpolateGeometry;
            data.velocityMaterial.uniforms.smearIntensity.value = smearIntensity;
            data.velocityMaterial.uniforms.prevProjectionMatrix.value.copy(projMat);
            data.velocityMaterial.uniforms.prevModelViewMatrix.value.multiplyMatrices(invMat, data.matrixWorld);
            this.renderer.renderBufferDirect(this.camera, null, mesh.geometry, data.velocityMaterial, mesh, null);

            this.saveCurrentObjectState(mesh);
        }
    }

    ensurePrevCameraTransform() {
        // Reinitialize the camera matrices to the current transform because if
        // the pass has been disabled then the matrices will be out of date
        if (this.cameraMatricesNeedInitializing) {
            this.prevCamProjection.copy(this.camera.projectionMatrix);
            this.prevCamWorldInverse.copy(this.camera.matrixWorldInverse);
            this.cameraMatricesNeedInitializing = false;
        }

        this.projScreenMatrix.multiplyMatrices(this.camera.projectionMatrix, this.camera.matrixWorldInverse);
        this.frustum.setFromProjectionMatrix(this.projScreenMatrix);
    }

    destroy() {
        this.screenTriangle.dispose();
        this.compositeMaterial.dispose();
        this.renderTarget.dispose();
        this.prevPosMap.clear();

        for (const prop in this) {
            this[prop] = null;
        }

        return null;
    }
}
