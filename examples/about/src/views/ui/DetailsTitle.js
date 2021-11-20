import { Interface, shuffle } from 'alien.js';

export class DetailsTitle extends Interface {
    constructor(copy) {
        super('.title', 'h1');

        this.copy = copy;
        this.letters = [];

        this.initText();
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
    }

    /**
     * Public methods
     */

    animateIn = () => {
        shuffle(this.letters);

        for (let i = 0; i < 2; i++) {
            const letter = this.letters[i];
            letter.clearTween().css({ opacity: 0 }).tween({ opacity: 1 }, 2000, 'easeOutCubic', 100 + i * 15);
        }
    };
}
