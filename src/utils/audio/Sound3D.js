/**
 * @author pschroen / https://ufo.ai/
 */

import { Group, Quaternion, Vector3 } from 'three';

import { WebAudio } from './WebAudio.js';
import { WebAudioParam } from './WebAudioParam.js';

import { clamp, guid, range } from '../Utils.js';

export class Sound3D extends Group {
    constructor(camera, id, buffer) {
        super();

        if (!WebAudio.context) {
            return;
        }

        if (typeof id !== 'string') {
            buffer = id;
            id = camera;
            camera = null;
        }

        this.context = WebAudio.context;

        if (camera) {
            this.camera = camera;
            this.cameraWorldPosition = new Vector3();
            this.worldPosition = new Vector3();

            this.audioDistance = 1;
            this.audioNearDistance = camera.near;
            this.audioFarDistance = camera.far;

            this.output = this.context.createGain();
            this.output.connect(WebAudio.input);

            this.gain = new WebAudioParam(this, 'output', 'gain', 1);

            this.screenSpacePosition = new Vector3();

            this.stereo = this.context.createStereoPanner();
            this.stereo.connect(this.output);

            this.stereoPan = new WebAudioParam(this, 'stereo', 'pan', 0);

            this.input = this.output;
        } else {
            this.worldPosition = new Vector3();
            this.worldQuaternion = new Quaternion();
            this.worldScale = new Vector3();
            this.worldOrientation = new Vector3();

            this.panner = this.context.createPanner();
            this.panner.panningModel = 'HRTF';
            this.panner.connect(WebAudio.input);

            this.audioPositionX = new WebAudioParam(this, 'panner', 'positionX', 0);
            this.audioPositionY = new WebAudioParam(this, 'panner', 'positionY', 0);
            this.audioPositionZ = new WebAudioParam(this, 'panner', 'positionZ', 0);
            this.audioOrientationX = new WebAudioParam(this, 'panner', 'orientationX', 0);
            this.audioOrientationY = new WebAudioParam(this, 'panner', 'orientationY', 0);
            this.audioOrientationZ = new WebAudioParam(this, 'panner', 'orientationZ', 1);

            this.output = this.panner;
            this.input = this.output;
        }

        if (buffer) {
            this.sound = WebAudio.add(this, id, buffer, true);
        } else {
            this.sound = WebAudio.clone(this, id, guid(), true);
        }
    }

    updateMatrixWorld(force) {
        super.updateMatrixWorld(force);

        if (!WebAudio.context) {
            return;
        }

        if (this.camera) {
            this.cameraWorldPosition.setFromMatrixPosition(this.camera.matrixWorld);
            this.worldPosition.setFromMatrixPosition(this.matrixWorld);

            this.gain.value = 1 - range(this.cameraWorldPosition.distanceTo(this.worldPosition) - this.audioDistance, this.audioNearDistance, this.audioFarDistance, 0, 1, true);

            this.screenSpacePosition.copy(this.worldPosition).project(this.camera);

            if (isNaN(this.screenSpacePosition.x)) {
                this.stereoPan.value = 0;
            } else {
                this.stereoPan.value = clamp(this.screenSpacePosition.x, -1, 1);
            }
        } else {
            this.matrixWorld.decompose(this.worldPosition, this.worldQuaternion, this.worldScale);
            this.worldOrientation.set(0, 0, 1).applyQuaternion(this.worldQuaternion);

            this.audioPositionX.value = this.worldPosition.x;
            this.audioPositionY.value = this.worldPosition.y;
            this.audioPositionZ.value = this.worldPosition.z;
            this.audioOrientationX.value = this.worldOrientation.x;
            this.audioOrientationY.value = this.worldOrientation.y;
            this.audioOrientationZ.value = this.worldOrientation.z;
        }
    }

    destroy() {
        WebAudio.remove(this.sound.id);
    }
}
