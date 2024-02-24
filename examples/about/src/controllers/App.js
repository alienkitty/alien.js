import { Stage, UI, WebAudio, ticker, wait } from '@alienkitty/space.js/three';

import { AudioController } from './audio/AudioController.js';
import { WorldController } from './world/WorldController.js';
import { FluidController } from './world/FluidController.js';
import { TrackersView } from '../views/TrackersView.js';

import { breakpoint, store } from '../config/Config.js';

export class App {
    static async init(bufferLoader) {
        this.bufferLoader = bufferLoader;

        const sound = localStorage.getItem('sound');
        store.sound = sound ? JSON.parse(sound) : true;

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
        this.ui = new UI({
            fps: true,
            breakpoint,
            header: {
                links: [
                    {
                        title: 'Alien.js',
                        link: 'https://github.com/alienkitty/alien.js'
                    }
                ]
            },
            details: {
                background: true,
                title: 'Multiuser Fluid'.replace(/[\s.]+/g, '_'),
                content: /* html */ `
A fluid shader tribute to Mr.doob’s Multiuser Sketchpad from 2010. Multiuser Fluid is an experiment to combine UI and data visualization elements in a multiuser environment.
                `,
                links: [
                    {
                        title: 'Source code',
                        link: 'https://glitch.com/edit/#!/multiuser-fluid'
                    },
                    {
                        title: 'Mr.doob’s Multiuser Sketchpad',
                        link: 'https://glitch.com/edit/#!/multiuser-sketchpad'
                    },
                    {
                        title: 'David A Roberts’ Single-pass Fluid Solver',
                        link: 'https://www.shadertoy.com/view/XlsBDf'
                    }
                ]
            },
            instructions: {
                content: `${navigator.maxTouchPoints ? 'Tap' : 'Click'} for sound`
            },
            detailsButton: true,
            muteButton: {
                sound: store.sound
            }
        });
        Stage.add(this.ui);

        this.trackers = new TrackersView();
        Stage.add(this.trackers);
    }

    static initControllers() {
        const { renderer, screen, screenCamera } = WorldController;

        FluidController.init(renderer, screen, screenCamera, this.trackers);
    }

    static initAudio() {
        WebAudio.init({ sampleRate: 48000 });
        WebAudio.load(this.bufferLoader.files);

        AudioController.init(this.ui);
    }

    static addListeners() {
        Stage.events.on('update', this.onUsers);
        Stage.events.on('details', this.onDetails);
        this.ui.muteButton.events.on('update', this.onMute);
        window.addEventListener('resize', this.onResize);
        ticker.add(this.onUpdate);
    }

    // Event handlers

    static onUsers = e => {
        this.ui.detailsButton.setData({ count: e.length });
    };

    static onDetails = ({ open }) => {
        if (open) {
            if (store.sound) {
                AudioController.trigger('about_section');
            }
        } else {
            if (store.sound) {
                AudioController.trigger('fluid_section');
            }
        }
    };

    static onMute = ({ sound }) => {
        if (sound) {
            AudioController.unmute();
        } else {
            AudioController.mute();
        }

        localStorage.setItem('sound', JSON.stringify(sound));

        store.sound = sound;
    };

    static onResize = () => {
        const width = document.documentElement.clientWidth;
        const height = document.documentElement.clientHeight;
        const dpr = 1; // Always 1

        WorldController.resize(width, height, dpr);
        AudioController.resize();
        FluidController.resize(width, height, dpr);
    };

    static onUpdate = (time, delta, frame) => {
        WorldController.update(time, delta, frame);
        FluidController.update();
        this.ui.update();
    };

    // Public methods

    static start = async () => {
        AudioController.start();
        AudioController.trigger('fluid_start');
        FluidController.animateIn();

        await wait(1000);

        this.ui.animateIn();
    };
}
