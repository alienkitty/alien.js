// import { Config } from '../config/Config.js';
import { Events } from '../config/Events.js';
import { Assets } from '../loaders/Assets.js';
import { WebAudio } from '../utils/audio/WebAudio.js';
import { AudioController } from './audio/AudioController.js';
import { WorldController } from './world/WorldController.js';
import { CameraController } from './world/CameraController.js';
import { SceneController } from './world/SceneController.js';
import { InputManager } from './world/InputManager.js';
import { RenderManager } from './world/RenderManager.js';
import { Stage } from './Stage.js';
import { SceneView } from '../views/SceneView.js';
import { LandingView } from '../views/LandingView.js';
// import { UIL } from '../utils/gui/UIL.js';
// import { WorldUIL } from '../gui/WorldUIL.js';
// import { CameraUIL } from '../gui/CameraUIL.js';
// import { RenderUIL } from '../gui/RenderUIL.js';
// import { MeshStandardMaterialUIL } from '../gui/MeshStandardMaterialUIL.js';

import { ticker } from '../tween/Ticker.js';

export class App {
    static async init(loader) {
        this.loader = loader;

        this.initWorld();
        this.initViews();
        this.initControllers();
        // this.initGUI();

        this.addListeners();
        this.onResize();

        await this.loader.ready();

        WebAudio.init(Assets.filter(path => /sounds/.test(path)));
        AudioController.init();

        await Promise.all([
            WorldController.textureLoader.ready(),
            WorldController.environmentLoader.ready(),
            SceneController.ready()
        ]);
    }

    static initWorld() {
        WorldController.init();
        Stage.add(WorldController.element);
    }

    static initViews() {
        this.view = new SceneView();
        WorldController.scene.add(this.view);

        this.landing = new LandingView();
        Stage.add(this.landing);
    }

    static initControllers() {
        const { renderer, scene, camera } = WorldController;

        CameraController.init(camera);
        SceneController.init(this.view);
        InputManager.init(camera);
        RenderManager.init(renderer, scene, camera);
    }

    /* static async initGUI() {
        if (!Config.GUI) {
            return;
        }

        UIL.init();

        await UIL.ready();

        WorldUIL.init();
        MeshStandardMaterialUIL.init('Cube', this.view);
        RenderUIL.init();
        CameraUIL.init();
    } */

    static addListeners() {
        Stage.events.on(Events.RESIZE, this.onResize);
        ticker.add(this.onUpdate);
    }

    static removeListeners() {
        Stage.events.off(Events.RESIZE, this.onResize);
        ticker.remove(this.onUpdate);
    }

    /**
     * Event handlers
     */

    static onResize = () => {
        const { width, height, dpr } = Stage;

        WorldController.resize(width, height, dpr);
        CameraController.resize(width, height);
        SceneController.resize();
        RenderManager.resize(width, height, dpr);
    };

    static onUpdate = (time, delta, frame) => {
        WorldController.update(time, delta, frame);
        CameraController.update();
        SceneController.update();
        InputManager.update(time);
        RenderManager.update(time, delta, frame);

        // if (Config.GUI) {
        //     UIL.update();
        // }
    };

    /**
     * Public methods
     */

    static start = () => {
        CameraController.animateIn();
        SceneController.animateIn();
        this.landing.animateIn();
    };
}
