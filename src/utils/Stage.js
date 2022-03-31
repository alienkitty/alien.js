/**
 * @author pschroen / https://ufo.ai/
 */

import { Events } from '../config/Events.js';
import { Interface } from './Interface.js';

import { ticker } from '../tween/Ticker.js';

export var Stage;

if (typeof window !== 'undefined') {
    Stage = new Interface(null, null);

    function addListeners() {
        window.addEventListener('popstate', onPopState);
        window.addEventListener('keydown', onKeyDown);
        window.addEventListener('keyup', onKeyUp);
        window.addEventListener('keypress', onKeyPress);
        window.addEventListener('resize', onResize);
        document.addEventListener('visibilitychange', onVisibility);

        ticker.start();
    }

    /**
     * Event handlers
     */

    function onPopState(e) {
        Stage.path = location.pathname;

        Stage.events.emit(Events.STATE_CHANGE, e);
    }

    function onKeyDown(e) {
        Stage.events.emit(Events.KEY_DOWN, e);
    }

    function onKeyUp(e) {
        Stage.events.emit(Events.KEY_UP, e);
    }

    function onKeyPress(e) {
        Stage.events.emit(Events.KEY_PRESS, e);
    }

    function onResize(e) {
        Stage.width = window.innerWidth;
        Stage.height = window.innerHeight;
        Stage.dpr = window.devicePixelRatio;
        Stage.aspect = Stage.width / Stage.height;

        Stage.events.emit(Events.RESIZE, e);
    }

    function onVisibility(e) {
        Stage.events.emit(Events.VISIBILITY, e);
    }

    /**
     * Public methods
     */

    Stage.init = element => {
        Stage.element = element;

        addListeners();
        onResize();
    };

    Stage.setPath = path => {
        history.pushState(null, null, path);

        onPopState();
    };
}
