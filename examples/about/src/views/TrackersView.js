import { Interface } from '@alienkitty/space.js/three';

export class TrackersView extends Interface {
    constructor() {
        super('.trackers');

        this.init();
    }

    init() {
        this.css({
            position: 'absolute',
            left: 0,
            top: 0,
            width: '100%',
            height: '100%',
            pointerEvents: 'none',
            webkitUserSelect: 'none',
            userSelect: 'none'
        });
    }
}
