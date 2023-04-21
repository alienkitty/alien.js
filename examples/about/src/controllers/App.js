import { Stage, WebAudio, ticker, wait } from '@alienkitty/space.js/three';

import { Global } from '../config/Global.js';
import { AudioController } from './audio/AudioController.js';
import { WorldController } from './world/WorldController.js';
import { FluidController } from './world/FluidController.js';
import { UI } from '../views/UI.js';
import { Trackers } from '../views/Trackers.js';

export class App {
    static async init(bufferLoader) {
        this.bufferLoader = bufferLoader;

        const sound = localStorage.getItem('sound');
        Global.SOUND = sound ? JSON.parse(sound) : true;

        this.initWorld();
        this.initViews();
        this.initControllers();

        this.addListeners();
        this.onResize();

        await Promise.all([
            document.fonts.ready,
            this.bufferLoader.ready()
        ]);

        this.initAudio();
    }

    static initWorld() {
        WorldController.init();
        Stage.add(WorldController.element);
    }

    static initViews() {
        this.ui = new UI();
        Stage.add(this.ui);

        this.trackers = new Trackers();
        Stage.add(this.trackers);
    }

    static initControllers() {
        const { renderer, screen, screenCamera } = WorldController;

        FluidController.init(renderer, screen, screenCamera, this.trackers);
    }

    static initAudio() {
        WebAudio.init({ sampleRate: 48000 });
        WebAudio.load(this.bufferLoader.files);

        AudioController.init(this.ui.instructions);
    }

    static addListeners() {
        window.addEventListener('resize', this.onResize);
        ticker.add(this.onUpdate);
    }

    /**
     * Event handlers
     */

    static onResize = () => {
        const width = document.documentElement.clientWidth;
        const height = document.documentElement.clientHeight;
        const dpr = 1;

        WorldController.resize(width, height, dpr);
        AudioController.resize();
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
        AudioController.start();
        AudioController.trigger('fluid_start');
        FluidController.animateIn();

        await wait(1000);

        this.ui.animateIn();
    };
}
