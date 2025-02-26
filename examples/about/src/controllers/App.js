import { Interface, Stage, UI, WebAudio, clearTween, delayedCall, ticker, wait } from '@alienkitty/space.js/three';

import { Data } from '../data/Data.js';
import { AudioController } from './audio/AudioController.js';
import { WorldController } from './world/WorldController.js';
import { FluidController } from './world/FluidController.js';
import { PanelController } from './panel/PanelController.js';
import { TrackersView } from '../views/TrackersView.js';

import { breakpoint, store } from '../config/Config.js';

export class App {
    static async init(loader) {
        this.loader = loader;

        const sound = localStorage.getItem('sound');
        store.sound = sound ? JSON.parse(sound) : true;

        this.initWorld();
        this.initViews();

        await Data.Socket.ready();

        this.initControllers();

        this.addListeners();
        this.onResize();

        await Promise.all([
            document.fonts.ready,
            this.loader.ready()
        ]);

        this.initAudio();
        this.initPanel();

        FluidController.start();
    }

    static initWorld() {
        WorldController.init();
        Stage.add(WorldController.element);
    }

    static initViews() {
        this.trackers = new TrackersView();
        Stage.add(this.trackers);

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
            info: {
                content: 'Observer'
            },
            details: {
                background: true,
                title: 'Multiuser Fluid'.replace(/[\s.-]+/g, '_'),
                content: [
                    {
                        content: /* html */ `
A fluid shader tribute to Mr.doob’s Multiuser Sketchpad from 2010. Multiuser Fluid is an experiment to combine UI and data visualization elements in a multiuser environment.
                        `,
                        links: [
                            {
                                title: 'Mr.doob’s Multiuser Sketchpad',
                                link: 'https://multiuser-sketchpad.glitch.me/'
                            },
                            {
                                title: 'David A Roberts’ Single-pass Fluid Solver',
                                link: 'https://www.shadertoy.com/view/XlsBDf'
                            },
                            {
                                title: 'Source code',
                                link: 'https://github.com/pschroen/multiuser-fluid'
                            }
                        ]
                    },
                    {
                        title: 'Development',
                        content: /* html */ `
Space.js
<br>Alien.js
<br>Three.js
                        `
                    },
                    {
                        title: 'Fonts',
                        content: /* html */ `
Roboto Mono
<br>D-DIN
<br>Gothic A1
                        `
                    },
                    {
                        title: 'Audio',
                        content: /* html */ `
AudioMicro
                        `
                    },
                    {
                        title: 'Users',
                        width: '100%'
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
        this.ui.css({ position: 'static' });
        Stage.add(this.ui);

        const content = new Interface('.content');
        content.css({
            width: 'fit-content'
        });
        this.ui.detailsUsers = this.ui.details.content[this.ui.details.content.length - 1].add(content);
        this.ui.detailsUsers.css({
            position: 'relative',
            display: 'flex',
            flexWrap: 'wrap',
            gap: 12
        });
    }

    static initControllers() {
        const { renderer, screen, screenCamera } = WorldController;

        FluidController.init(renderer, screen, screenCamera, this.trackers, this.ui);
    }

    static initAudio() {
        WebAudio.init({ sampleRate: 48000 });
        WebAudio.load(this.loader.files);

        AudioController.init(this.ui);
    }

    static initPanel() {
        PanelController.init(this.ui);
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
        clearTween(this.timeout);

        if (open) {
            document.documentElement.classList.add('scroll');

            this.ui.detailsUsers.children.forEach((child, i) => {
                child.enable();
                child.animateIn(1075 + i * 15, true);
            });

            if (store.sound) {
                AudioController.trigger('about_section');
            }
        } else {
            this.timeout = delayedCall(400, () => {
                document.documentElement.classList.remove('scroll');

                this.ui.detailsUsers.children.forEach(child => {
                    child.disable();
                });
            });

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

        AudioController.resize();
        WorldController.resize(width, height, dpr);
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
    };

    static animateIn = async () => {
        FluidController.animateIn();

        await wait(1000);

        this.ui.animateIn();
    };
}
