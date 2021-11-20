/**
 * @author pschroen / https://ufo.ai/
 */

export class WebAudioParam {
    constructor(parent, node, param, alpha) {
        this.parent = parent;
        this.node = node;
        this.param = param;
        this.alpha = alpha;

        if (this.parent[this.node]) {
            this.parent[this.node][this.param].cancelScheduledValues(this.parent.context.currentTime);
            this.parent[this.node][this.param].setValueAtTime(this.alpha, this.parent.context.currentTime);
        }
    }

    get value() {
        return this.alpha;
    }

    set value(value) {
        if (this.alpha === value) {
            return;
        }

        if (this.parent[this.node]) {
            this.parent[this.node][this.param].cancelScheduledValues(this.parent.context.currentTime);
            this.parent[this.node][this.param].setTargetAtTime(value, this.parent.context.currentTime, 0.1);
        }

        this.alpha = value;
    }

    fade(value, time) {
        if (this.parent[this.node]) {
            this.parent[this.node][this.param].cancelScheduledValues(this.parent.context.currentTime);
            this.parent[this.node][this.param].setTargetAtTime(value, this.parent.context.currentTime, time * 0.001);
        }
    }
}
