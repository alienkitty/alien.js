/**
 * Slide video.
 *
 * @author Patrick Schroen / https://github.com/pschroen
 */

import { Events } from '../util/Events';
import { Device } from '../util/Device';
import { Assets } from '../util/Assets';

class SlideVideo {

    constructor(params, callback) {
        if (!SlideVideo.initialized) {
            SlideVideo.test = SlideVideo.test || !Device.mobile && Device.browser !== 'safari' && !Device.detect('trident');

            SlideVideo.initialized = true;
        }
        const self = this;
        this.events = new Events();
        this.img = params.img;
        if (this.img) this.img = Assets.CDN + this.img;
        this.src = params.src;
        if (this.src) this.src = Assets.CDN + this.src;

        if (this.src && SlideVideo.test) {
            window.fetch(this.src).then(response => {
                if (!response.ok) return error();
                response.blob().then(data => {
                    this.element = document.createElement('video');
                    this.element.src = URL.createObjectURL(data);
                    this.element.muted = true;
                    this.element.loop = true;
                    ready();
                    if (callback) callback();
                });
            }).catch(() => {
                error();
                if (callback) callback();
            });
        } else {
            const img = Assets.createImage(this.img);
            img.onload = () => {
                this.element = img;
                if (callback) callback();
            };
            img.onerror = error;
        }

        function error() {
            self.events.fire(Events.ERROR);
        }

        function ready() {
            self.element.addEventListener('playing', playing, true);
            self.element.addEventListener('pause', pause, true);
            if (self.willPlay) self.play();
        }

        function playing() {
            self.playing = true;
            self.events.fire(Events.READY);
        }

        function pause() {
            self.playing = false;
        }

        this.resume = () => {
            this.play(true);
        };

        this.play = (resume = false) => {
            this.willPlay = true;
            if (this.element && this.element.paused && !this.playing) {
                if (!resume) this.element.currentTime = 0;
                this.element.play();
            }
        };

        this.pause = () => {
            this.willPlay = false;
            if (this.element && !this.element.paused && this.playing) this.element.pause();
        };

        this.ready = () => {
            return this.element.readyState > this.element.HAVE_CURRENT_DATA;
        };

        this.destroy = () => {
            this.pause();
            this.element.src = '';
        };
    }
}

export { SlideVideo };
