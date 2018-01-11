/**
 * Loader helper class.
 *
 * @author Patrick Schroen / https://github.com/pschroen
 */

import { Events } from './Events';

class MultiLoader {

    constructor() {
        const self = this;
        this.events = new Events();
        const loaders = [];
        let loaded = 0;

        function progress() {
            let percent = 0;
            for (let i = 0; i < loaders.length; i++) percent += loaders[i].percent || 0;
            percent /= loaders.length;
            self.events.fire(Events.PROGRESS, { percent });
        }

        function complete() {
            if (++loaded === loaders.length) self.events.fire(Events.COMPLETE);
        }

        this.push = loader => {
            loaders.push(loader);
            loader.events.add(Events.PROGRESS, progress);
            loader.events.add(Events.COMPLETE, complete);
        };

        this.complete = () => {
            this.events.fire(Events.PROGRESS, { percent: 1 });
            this.events.fire(Events.COMPLETE);
        };
    }
}

export { MultiLoader };
