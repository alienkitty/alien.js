/**
 * @author pschroen / https://ufo.ai/
 */

import { Interface } from '../Interface.js';
import { ListToggle } from './ListToggle.js';
import { ListSelect } from './ListSelect.js';

export class List extends Interface {
    constructor({
        list,
        index,
        callback
    }) {
        super('.list');

        this.list = list;
        this.index = index;
        this.callback = callback;

        this.items = [];

        this.initHTML();
        this.initViews();
    }

    initHTML() {
        this.css({
            width: '100%',
            height: 18
        });
    }

    initViews() {
        if (this.list.length > 2) {
            const item = new ListSelect({ list: this.list, index: this.index });
            item.events.on('click', this.onClick);
            this.add(item);
            this.items.push(item);
        } else {
            this.list.forEach((label, i) => {
                const item = new ListToggle({ label, index: i });
                item.events.on('click', this.onClick);

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

        this.events.emit('update', value);

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
