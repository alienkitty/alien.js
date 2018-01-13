/**
 * State dispatcher.
 *
 * @author Patrick Schroen / https://github.com/pschroen
 */

import { Events } from './Events';

class StateDispatcher {

    constructor(forceHash) {
        const self = this;
        this.events = new Events();
        this.locked = false;
        let storePath, storeState,
            rootPath = '/';

        createListener();
        storePath = getPath();

        function createListener() {
            if (forceHash) window.addEventListener('hashchange', () => handleStateChange(null, getPath()), true);
            else window.addEventListener('popstate', e => handleStateChange(e.state, getPath()), true);
        }

        function getPath() {
            if (forceHash) return location.hash.slice(3);
            return rootPath !== '/' ? location.pathname.split(rootPath)[1] : location.pathname.slice(1) || '';
        }

        function handleStateChange(state, path) {
            if (path !== storePath) {
                if (!self.locked) {
                    storePath = path;
                    storeState = state;
                    self.events.fire(Events.UPDATE, { value: state, path, split: path.split('/') });
                } else if (storePath) {
                    if (forceHash) location.hash = '!/' + storePath;
                    else history.pushState(storeState, null, rootPath + storePath);
                }
            }
        }

        this.getState = () => {
            const path = getPath();
            return { value: storeState, path, split: path.split('/') };
        };

        this.setState = (state, path) => {
            if (typeof state !== 'object') {
                path = state;
                state = null;
            }
            if (path !== storePath) {
                storePath = path;
                storeState = state;
                if (forceHash) location.hash = '!/' + path;
                else history.pushState(state, null, rootPath + path);
            }
        };

        this.replaceState = (state, path) => {
            if (typeof state !== 'object') {
                path = state;
                state = null;
            }
            if (path !== storePath) {
                storePath = path;
                storeState = state;
                if (forceHash) history.replaceState(null, null, '#!/' + path);
                else history.replaceState(state, null, rootPath + path);
            }
        };

        this.setTitle = title => document.title = title;

        this.lock = () => this.locked = true;

        this.unlock = () => this.locked = false;

        this.forceHash = () => forceHash = true;

        this.setPathRoot = path => {
            if (path.charAt(0) === '/') rootPath = path;
            else rootPath = '/' + path;
        };
    }
}

export { StateDispatcher };
