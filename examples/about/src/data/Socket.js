import { EventEmitter, Events, Stage } from 'alien.js';

import { Global } from '../config/Global.js';

export class Socket extends EventEmitter {
    constructor() {
        super();

        this.connected = false;
    }

    init() {
        this.socket = new WebSocket('wss://multiuser-fluid.glitch.me/');
        // this.socket.binaryType = 'arraybuffer';

        this.addListeners();
    }

    addListeners() {
        this.socket.addEventListener('close', this.onClose);
        this.socket.addEventListener('message', this.onMessage);
        this.on('users', this.onUsers);
        this.on('heartbeat', this.onHeartbeat);
    }

    /**
     * Event handlers
     */

    onClose = () => {
        this.connected = false;
    };

    onMessage = ({ data }) => {
        data = JSON.parse(data);

        if (data.event) {
            this.emit(data.event, data.message);
        }
    };

    onUsers = e => {
        Global.USERS = e;

        Stage.events.emit(Events.UPDATE, e);
    };

    onHeartbeat = e => {
        if (!this.connected) {
            this.connected = true;
            this.id = e.id;

            this.nickname();
        }

        this.send('heartbeat', e);
    };

    /**
     * Public methods
     */

    nickname = () => {
        this.send('nickname', { nickname: Global.NICKNAME });
    };

    send = (event, message = {}) => {
        if (!this.connected) {
            return;
        }

        message.id = this.id;

        this.socket.send(JSON.stringify({ event, message }));
    };
}
