import { Events, Interface } from 'alien.js';

export class DetailsLink extends Interface {
    constructor(copy, link) {
        super('.link', 'a');

        this.copy = copy;
        this.link = link;

        this.initHTML();

        this.addListeners();
    }

    initHTML() {
        this.css({
            lineHeight: 22
        });
        this.attr({ href: this.link });

        this.text = new Interface('.text');
        this.text.css({
            position: 'relative',
            display: 'inline-block'
        });
        this.text.text(this.copy);
        this.add(this.text);

        this.line = new Interface('.line');
        this.line.css({
            position: 'relative',
            display: 'inline-block',
            fontWeight: '700'
        });
        this.line.html('&nbsp;&nbsp;―');
        this.add(this.line);
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
        this.line.tween({ x: type === 'mouseenter' ? 10 : 0 }, 200, 'easeOutCubic');
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
