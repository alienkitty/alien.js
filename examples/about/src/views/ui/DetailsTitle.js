import { Interface, shuffle } from '@alienkitty/space.js/three';

import { Styles } from '../../config/Styles.js';

export class DetailsTitle extends Interface {
    constructor(title) {
        super('.title', 'h1');

        this.title = title;
        this.letters = [];

        this.initHTML();
        this.initText();
    }

    initHTML() {
        this.css({
            ...Styles.h1
        });
    }

    initText() {
        const split = this.title.split('');

        split.forEach(str => {
            if (str === ' ') {
                str = '&nbsp';
            }

            const letter = new Interface(null, 'span');
            letter.css({ display: 'inline-block' });
            letter.html(str);
            this.add(letter);

            this.letters.push(letter);
        });
    }

    // Public methods

    animateIn = () => {
        shuffle(this.letters);

        const underscores = this.letters.filter(letter => letter === '_');

        underscores.forEach((letter, i) => {
            letter.clearTween().css({ opacity: 0 }).tween({ opacity: 1 }, 2000, 'easeOutCubic', i * 15);
        });

        const letters = this.letters.filter(letter => letter !== '_').slice(0, 2);

        letters.forEach((letter, i) => {
            letter.clearTween().css({ opacity: 0 }).tween({ opacity: 1 }, 2000, 'easeOutCubic', 100 + i * 15);
        });
    };
}
