import { BufferLoader, MultiLoader, Stage } from '@alienkitty/space.js/three';

import { Data } from '../data/Data.js';
import { PreloaderView } from '../views/PreloaderView.js';

export class Preloader {
    static init() {
        Data.init();
        Data.Socket.init();

        this.initStage();
        this.initView();
        this.initLoader();

        this.addListeners();
    }

    static initStage() {
        Stage.init();
    }

    static initView() {
        this.view = new PreloaderView();
        Stage.add(this.view);
    }

    static async initLoader() {
        this.view.animateIn();

        const bufferLoader = new BufferLoader();
        bufferLoader.loadAll([
            'assets/sounds/bass_drum.mp3',
            'assets/sounds/deep_spacy_loop.mp3',
            'assets/sounds/water_loop.mp3'
        ]);

        this.loader = new MultiLoader();
        this.loader.load(bufferLoader);
        this.loader.add(2);

        const { App } = await import('./App.js');
        this.loader.trigger(1);

        this.app = App;

        await this.app.init(bufferLoader);
        this.loader.trigger(1);
    }

    static addListeners() {
        this.loader.events.on('progress', this.view.onProgress);
        this.view.events.on('complete', this.onComplete);
    }

    static removeListeners() {
        this.loader.events.off('progress', this.view.onProgress);
        this.view.events.off('complete', this.onComplete);
    }

    // Event handlers

    static onComplete = async () => {
        this.removeListeners();

        this.loader = this.loader.destroy();

        await this.view.animateOut();
        this.view = this.view.destroy();

        this.app.start();
    };
}
