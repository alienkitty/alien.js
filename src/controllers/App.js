// import { Events } from '../config/Events.js';
// import { Assets } from '../loaders/Assets.js';
// import { WebAudio } from '../utils/audio/WebAudio.js';
// import { AudioController } from './audio/AudioController.js';
// import { WorldController } from './world/WorldController.js';
// import { CameraController } from './world/CameraController.js';
// import { SceneController } from './world/SceneController.js';
// import { InputManager } from './world/InputManager.js';
// import { RenderManager } from './world/RenderManager.js';
import { Stage } from './Stage.js';
// import { SceneView } from '../views/SceneView.js';
import { LandingView } from '../views/LandingView.js';

// import { ticker } from '../utils/Tween.js';

export class App {
    static async init(loader) {
        this.loader = loader;

        // this.initWorld();
        this.initViews();
        // this.initControllers();

        // this.addListeners();
        // this.onResize();

        await this.loader.ready();

        // WebAudio.init(Assets.filter(path => /sounds/.test(path)));
        // AudioController.init();

        // await Promise.all([
        //     WorldController.textureLoader.ready(),
        //     SceneController.ready()
        // ]);
    }

    /* static initWorld() {
        WorldController.init();
        Stage.add(WorldController.element);
    } */

    static initViews() {
        // this.view = new SceneView();
        // WorldController.scene.add(this.view);

        this.landing = new LandingView();
        Stage.add(this.landing);
    }

    /* static initControllers() {
        const { renderer, scene, camera } = WorldController;

        CameraController.init(camera);
        InputManager.init(camera);
        SceneController.init(this.view);
        RenderManager.init(renderer, scene, camera);
    }

    static addListeners() {
        Stage.events.on(Events.RESIZE, this.onResize);
        ticker.add(this.onUpdate);
    } */

    /**
     * Event handlers
     */

    /* static onResize = () => {
        const { width, height, dpr } = Stage;

        WorldController.resize(width, height, dpr);
        CameraController.resize(width, height);
        SceneController.resize();
        RenderManager.resize(width, height, dpr);
    };

    static onUpdate = (time, delta, frame) => {
        WorldController.update(time, delta, frame);
        CameraController.update(time);
        SceneController.update();
        InputManager.update();
        RenderManager.update(time, delta, frame);
    }; */

    /**
     * Public methods
     */

    static start = () => {
        // CameraController.animateIn();
        // SceneController.animateIn();
        this.landing.animateIn();
    };
}
