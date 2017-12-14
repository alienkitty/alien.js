/**
 * Post processing effects.
 *
 * @author Patrick Schroen / https://github.com/pschroen
 */

/* global THREE */

import { Events } from '../util/Events';
import { Stage } from '../view/Stage';
import { Utils3D } from './Utils3D';

class Effects {

    constructor(stage, params) {
        const self = this;
        this.stage = stage;
        this.renderer = params.renderer;
        this.scene = params.scene;
        this.camera = params.camera;
        this.shader = params.shader;
        this.dpr = params.dpr || 1;
        let renderTarget, camera, scene, mesh;

        initEffects();
        addListeners();

        function initEffects() {
            renderTarget = Utils3D.createRT(self.stage.width * self.dpr, self.stage.height * self.dpr);
            self.texture = renderTarget.texture;
            self.texture.minFilter = THREE.LinearFilter;
            camera = new THREE.OrthographicCamera(self.stage.width / -2, self.stage.width / 2, self.stage.height / 2, self.stage.height / -2, 1, 1000);
            scene = new THREE.Scene();
            mesh = new THREE.Mesh(new THREE.PlaneBufferGeometry(2, 2), self.shader.material);
            scene.add(mesh);
        }

        function addListeners() {
            Stage.events.add(Events.RESIZE, resize);
        }

        function resize() {
            renderTarget.dispose();
            renderTarget = Utils3D.createRT(self.stage.width * self.dpr, self.stage.height * self.dpr);
            camera.left = self.stage.width / -2;
            camera.right = self.stage.width / 2;
            camera.top = self.stage.height / 2;
            camera.bottom = self.stage.height / -2;
            camera.updateProjectionMatrix();
        }

        this.render = () => {
            this.renderer.render(this.scene, this.camera, renderTarget, true);
            mesh.material.uniforms.texture.value = renderTarget.texture;
            this.renderer.render(scene, camera);
        };
    }
}

export { Effects };
