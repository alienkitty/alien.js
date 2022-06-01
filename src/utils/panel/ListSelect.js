/**
 * @author pschroen / https://ufo.ai/
 */

import { Events } from '../../config/Events.js';
import { Interface } from '../Interface.js';

export class ListSelect extends Interface {
    constructor({
        list,
        index,
        styles
    }) {
        super('.list-select');

        this.list = list;
        this.index = index;
        this.styles = styles;

        this.clicked = false;

        this.initHTML();

        this.addListeners();
    }

    initHTML() {
        this.css({
            position: 'relative',
            width: '100%',
            height: 18,
            textTransform: 'uppercase',
            ...this.styles.panel,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            cursor: 'pointer'
        });

        this.text = new Interface('.text');
        this.text.css({
            position: 'absolute',
            width: '100%',
            height: '100%'
        });
        this.text.text(this.list[this.index]);
        this.add(this.text);

        this.over = new Interface('.over');
        this.over.css({
            position: 'absolute',
            width: '100%',
            height: '100%',
            opacity: 0
        });
        this.over.text(this.list[this.getNextIndex()]);
        this.add(this.over);
    }

    getNextIndex = () => {
        this.next = this.index + 1;

        if (this.next >= this.list.length) {
            this.next = 0;
        }

        return this.next;
    };

    addListeners() {
        this.element.addEventListener('click', this.onClick);
    }

    removeListeners() {
        this.element.removeEventListener('click', this.onClick);
    }

    /**
     * Event handlers
     */

    onClick = () => {
        if (this.clicked) {
            return;
        }

        this.clicked = true;

        this.index = this.next;

        this.text.tween({ y: -8, opacity: 0 }, 100, 'easeOutCubic');
        this.over.css({ y: 8, opacity: 0 }).tween({ y: 0, opacity: 1 }, 175, 'easeOutCubic', 50, () => {
            this.text.text(this.list[this.index]);
            this.text.css({ y: 0, opacity: 1 });
            this.over.css({ y: 8, opacity: 0 });
            this.over.text(this.list[this.getNextIndex()]);

            this.clicked = false;
        });

        this.events.emit(Events.CLICK, { target: this });
    };

    /**
     * Public methods
     */

    destroy = () => {
        this.removeListeners();

        return super.destroy();
    };
}
