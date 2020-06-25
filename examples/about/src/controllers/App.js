import { Assets, Stage, WebAudio, ticker, wait } from 'alien.js';

import { Events } from '../config/Events.js';
import { Data } from '../data/Data.js';
import { AudioController } from './audio/AudioController.js';
import { WorldController } from './world/WorldController.js';
import { FluidController } from './world/FluidController.js';
import { Trackers } from '../views/Trackers.js';
import { UI } from '../views/UI.js';

export class App {
    static async init(loader) {
        this.loader = loader;

        Data.init();
        Data.Socket.init();

        this.initWorld();
        this.initViews();
        this.initControllers();

        this.addListeners();
        this.onResize();

        await this.loader.ready();

        WebAudio.init(Assets.filter(path => /sounds/.test(path)));
        AudioController.init();
    }

    static initWorld() {
        WorldController.init();
        Stage.add(WorldController.element);
    }

    static initViews() {
        this.trackers = new Trackers();
        Stage.add(this.trackers);

        this.ui = new UI();
        Stage.add(this.ui);
    }

    static initControllers() {
        const { renderer, scene, camera, screen } = WorldController;

        FluidController.init(renderer, scene, camera, screen, this.trackers);
    }

    static addListeners() {
        Stage.events.on(Events.RESIZE, this.onResize);
        ticker.add(this.onUpdate);
    }

    /**
     * Event handlers
     */

    static onResize = () => {
        const width = Stage.width;
        const height = Stage.height;
        // const dpr = Stage.dpr;
        // const dpr = Math.min(Stage.dpr, 1.5);
        const dpr = 1;

        WorldController.resize(width, height, dpr);
        FluidController.resize(width, height, dpr);
    };

    static onUpdate = (time, delta, frame) => {
        WorldController.update(time, delta, frame);
        FluidController.update();

        this.ui.update();
    };

    /**
     * Public methods
     */

    static start = async () => {
        FluidController.animateIn();
        AudioController.trigger('fluid_start');

        await wait(1000);

        Stage.events.emit(Events.UI_SHOW);
    };
}
