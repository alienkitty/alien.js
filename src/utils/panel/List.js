/**
 * @author pschroen / https://ufo.ai/
 */

import { Events } from '../../config/Events.js';
import { Interface } from '../Interface.js';
import { ListToggle } from './ListToggle.js';
import { ListSelect } from './ListSelect.js';

export class List extends Interface {
    constructor({
        list,
        index,
        callback,
        styles
    }) {
        super('.list');

        this.list = list;
        this.index = index;
        this.callback = callback;
        this.styles = styles;

        this.items = [];

        this.initHTML();
        this.initViews();
    }

    initHTML() {
        this.css({
            position: 'relative',
            width: '100%',
            height: 15
        });
    }

    initViews() {
        if (this.list.length > 2) {
            const item = new ListSelect({ list: this.list, index: this.index, styles: this.styles });
            item.events.on(Events.CLICK, this.onClick);
            this.add(item);
            this.items.push(item);
        } else {
            this.list.forEach((label, i) => {
                const item = new ListToggle({ label, index: i, styles: this.styles });
                item.events.on(Events.CLICK, this.onClick);

                if (this.index === i) {
                    item.onHover({ type: 'mouseenter' });
                    item.active();
                }

                this.add(item);
                this.items.push(item);
            });
        }
    }

    /**
     * Event handlers
     */

    onClick = ({ target }) => {
        const value = this.list[target.index];

        this.events.emit(Events.UPDATE, value);

        if (this.callback) {
            this.callback(value);
        }

        if (this.list.length > 2) {
            return;
        }

        if (!target.clicked) {
            target.active();
        }

        this.items.forEach(item => {
            if (item !== target && item.clicked) {
                item.inactive();
            }
        });
    };
}
