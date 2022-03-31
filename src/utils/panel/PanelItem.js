/**
 * @author pschroen / https://ufo.ai/
 */

import { Styles } from '../../config/Styles.js';
import { Interface } from '../Interface.js';
import { ColorPicker } from './ColorPicker.js';
import { List } from './List.js';
import { Slider } from './Slider.js';

export class PanelItem extends Interface {
    static styles = Styles;

    constructor(data) {
        super('.panel-item');

        this.data = data;
        this.data.styles = this.data.styles || PanelItem.styles;

        this.width = 128;

        this.initHTML();
    }

    initHTML() {
        const width = this.width;

        if (!this.data.type) {
            this.css({
                position: 'relative',
                boxSizing: 'border-box',
                width,
                padding: '10px 10px 0',
                marginBottom: 10
            });

            this.text = new Interface('.text');
            this.text.css({
                position: 'relative',
                ...this.data.styles.panel,
                textTransform: 'uppercase',
                whiteSpace: 'nowrap'
            });
            this.text.text(this.data.label);
            this.add(this.text);
        } else if (this.data.type === 'spacer') {
            this.css({
                position: 'relative',
                boxSizing: 'border-box',
                width,
                height: 7
            });
        } else if (this.data.type === 'divider') {
            this.css({
                position: 'relative',
                boxSizing: 'border-box',
                width,
                padding: '0 10px',
                margin: '7px 0'
            });

            this.line = new Interface('.line');
            this.line.css({
                position: 'relative',
                width: '100%',
                height: 1,
                backgroundColor: 'rgba(var(--ui-color-triplet), 0.25)',
                transformOrigin: 'left center'
            });
            this.add(this.line);
        } else if (this.data.type === 'color') {
            this.css({
                position: 'relative',
                boxSizing: 'border-box',
                width,
                height: 19,
                padding: '0 10px',
                marginBottom: 7
            });

            this.color = new ColorPicker(this.data);
            this.add(this.color);
        } else if (this.data.type === 'list') {
            this.css({
                position: 'relative',
                boxSizing: 'border-box',
                width,
                padding: '2px 10px 3px'
            });

            const list = Object.keys(this.data.list);
            const index = list.indexOf(this.data.value);
            const callback = this.data.callback;
            const styles = this.data.styles;

            this.text = new List({ list, index, callback, styles });
            this.add(this.text);
        } else if (this.data.type === 'slider') {
            this.css({
                position: 'relative',
                boxSizing: 'border-box',
                width,
                padding: '0 10px'
            });

            this.text = new Slider(this.data);
            this.add(this.text);
        }
    }

    /**
     * Public methods
     */

    animateIn = (delay, fast) => {
        if (this.data && this.data.type === 'group') {
            this.line.clearTween().css({ scaleX: 0, opacity: 1 }).tween({ scaleX: 1 }, 400, 'easeInOutCubic', delay);
        }

        this.clearTween().css({ y: fast ? 0 : -10, opacity: 0 }).tween({ y: 0, opacity: 1 }, 400, 'easeOutCubic', delay);
    };

    animateOut = (index, total, delay, callback) => {
        if (this.data && this.data.type === 'group') {
            this.line.clearTween().tween({ scaleX: 0, opacity: 0 }, 500, 'easeInCubic', delay);
        }

        this.clearTween().tween({ y: -10, opacity: 0 }, 500, 'easeInCubic', delay, () => {
            if (index === 0 && callback) {
                callback();
            }
        });
    };
}
