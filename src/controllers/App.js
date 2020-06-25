// import { Events } from '../config/Events.js';
import { Interface } from '../utils/Interface.js';
import { Stage } from './Stage.js';
import { AlienKitty } from '../views/AlienKitty.js';

export class App {
    static async init(loader) {
        this.loader = loader;

        this.initStage();
        this.initWrapper();
        this.initViews();

        this.addListeners();
        // this.onResize();

        await this.loader.ready();

        // WebAudio.init(Assets.filter(path => /sounds/.test(path)));
        // AudioController.init();
    }

    static initStage() {
        Stage.css({
            transformStyle: 'preserve-3d',
            perspective: 2000
        });
    }

    static initWrapper() {
        this.wrapper = new Interface('.wrapper');
        this.wrapper.css({
            width: '100%',
            height: '100%',
            transformStyle: 'preserve-3d',
            z: -300
        });
        Stage.add(this.wrapper);
    }

    static initViews() {
        this.alienkitty = new AlienKitty();
        this.alienkitty.css({
            left: '50%',
            top: '50%',
            marginLeft: -90 / 2,
            marginTop: -86 / 2
        });
        this.wrapper.add(this.alienkitty);
    }

    static addListeners() {
        // Stage.events.on(Events.RESIZE, this.onResize);
        // ticker.add(this.onUpdate);
    }

    /**
     * Event handlers
     */

    // static onResize = () => {
    // };

    // static onUpdate = (time, delta, frame) => {
    // };

    /**
     * Public methods
     */

    static start = async () => {
        this.wrapper.tween({ z: 0 }, 7000, 'easeOutCubic');
        this.alienkitty.animateIn();
    };
}
