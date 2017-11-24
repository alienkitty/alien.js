/**
 * Linked list.
 *
 * @author Patrick Schroen / https://github.com/pschroen
 */

import { Utils } from './Utils';

class LinkedList {

    constructor() {
        this.first = null;
        this.last = null;
        this.current = null;
        this.prev = null;
        let nodes = [];

        function add(object) {
            return nodes[nodes.push({ object, prev: null, next: null }) - 1];
        }

        function remove(object) {
            for (let i = nodes.length - 1; i > -1; i--) {
                if (nodes[i].object === object) {
                    nodes[i] = null;
                    nodes.splice(i, 1);
                    break;
                }
            }
        }

        function destroy() {
            for (let i = nodes.length - 1; i > -1; i--) {
                nodes[i] = null;
                nodes.splice(i, 1);
            }
            return null;
        }

        function find(object) {
            for (let i = 0; i < nodes.length; i++) if (nodes[i].object === object) return nodes[i];
            return null;
        }

        this.push = object => {
            let obj = add(object);
            if (!this.first) {
                obj.next = obj.prev = this.last = this.first = obj;
            } else {
                obj.next = this.first;
                obj.prev = this.last;
                this.last.next = obj;
                this.last = obj;
            }
        };

        this.remove = object => {
            let obj = find(object);
            if (!obj || !obj.next) return;
            if (nodes.length <= 1) {
                this.empty();
            } else {
                if (obj === this.first) {
                    this.first = obj.next;
                    this.last.next = this.first;
                    this.first.prev = this.last;
                } else if (obj == this.last) {
                    this.last = obj.prev;
                    this.last.next = this.first;
                    this.first.prev = this.last;
                } else {
                    obj.prev.next = obj.next;
                    obj.next.prev = obj.prev;
                }
            }
            remove(object);
        };

        this.empty = () => {
            this.first = null;
            this.last = null;
            this.current = null;
            this.prev = null;
        };

        this.start = () => {
            this.current = this.first;
            this.prev = this.current;
            return this.current;
        };

        this.next = () => {
            if (!this.current) return;
            if (nodes.length === 1 || this.prev.next === this.first) return;
            this.current = this.current.next;
            this.prev = this.current;
            return this.current;
        };

        this.destroy = () => {
            nodes = destroy();
            return Utils.nullObject(this);
        };
    }
}

export { LinkedList };
