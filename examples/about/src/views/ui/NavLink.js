import { Interface } from 'alien.js';

import { Events } from '../../config/Events.js';

export class NavLink extends Interface {
    constructor(copy, link) {
        super('.link', 'a');

        this.copy = copy;
        this.link = link;
        this.letters = [];

        this.initHTML();
        this.initText();

        this.addListeners();
    }

    initHTML() {
        this.css({
            cssFloat: 'left',
            padding: 10,
            lineHeight: 15,
            whiteSpace: 'nowrap',
            pointerEvents: 'auto'
        });
        this.attr({ href: this.link });
    }

    initText() {
        const split = this.copy.split('');
        split.forEach(str => {
            if (str === ' ') {
                str = '&nbsp';
            }

            const letter = new Interface(null, 'span');
            letter.html(str);
            this.add(letter);

            this.letters.push(letter);
        });

        /* const split = this.copy.split(' ');
        split.forEach((str, i) => {
            if (i < split.length - 1) {
                str += '&nbsp';
            }

            const word = new Interface(null, 'span');
            word.html(str);
            this.add(word);

            this.words.push(word);
        }); */
    }

    addListeners() {
        this.element.addEventListener('mouseenter', this.onHover);
        this.element.addEventListener('mouseleave', this.onHover);
        this.element.addEventListener('click', this.onClick);
    }

    removeListeners() {
        this.element.removeEventListener('mouseenter', this.onHover);
        this.element.removeEventListener('mouseleave', this.onHover);
        this.element.removeEventListener('click', this.onClick);
    }

    /**
     * Event handlers
     */

    onHover = ({ type }) => {
        if (type === 'mouseenter') {
            this.letters.forEach((letter, i) => {
                letter.clearTween().tween({ y: -5, opacity: 0 }, 125, 'easeOutCubic', i * 15, () => {
                    letter.css({ y: 5 }).tween({ y: 0, opacity: 1 }, 300, 'easeOutCubic');
                });
            });
        }
    };

    onClick = () => {
        this.events.emit(Events.CLICK);
    };

    /**
     * Public methods
     */

    destroy = () => {
        this.removeListeners();

        return super.destroy();
    };
}
