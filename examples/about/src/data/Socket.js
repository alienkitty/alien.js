import { EventEmitter, Stage } from '@alienkitty/space.js/three';

import { numPointers, store } from '../config/Config.js';

export class Socket extends EventEmitter {
    constructor() {
        super();

        this.views = [];
        // 0: USERS: EVENT_ID(UINT8), MOUSE_ID(UINT8), NICKNAME(UINT8), REMOTE_ADDRESS(UINT32), LATENCY(UINT16)
        // 1: HEARTBEAT: EVENT_ID(UINT8), MOUSE_ID(UINT8), TIME(UINT64)
        // 2: NICKNAME: EVENT_ID(UINT8), MOUSE_ID(UINT8), NICKNAME(UINT8)
        this.views[2] = new DataView(new ArrayBuffer(1 + 1 + 10));
        // 3: MOTION: EVENT_ID(UINT8), MOUSE_ID(UINT8), IS_DOWN(UINT8), X(FLOAT32), Y(FLOAT32)
        this.views[3] = new DataView(new ArrayBuffer(1 + 1 + 1 + 4 + 4));

        this.encoder = new TextEncoder();
        this.decoder = new TextDecoder();

        this.connected = false;

        this.promise = new Promise(resolve => this.resolve = resolve);
    }

    init() {
        this.server = 'wss://multiuser-fluid.glitch.me';

        this.connect();
    }

    addListeners() {
        this.socket.addEventListener('close', this.onClose);
        this.socket.addEventListener('message', this.onMessage);
        this.on('users', this.onUsers);
        this.on('heartbeat', this.onHeartbeat);
    }

    removeListeners() {
        this.socket.removeEventListener('close', this.onClose);
        this.socket.removeEventListener('message', this.onMessage);
        this.off('users', this.onUsers);
        this.off('heartbeat', this.onHeartbeat);
    }

    ip2long(ip) {
        let ipl = 0;

        ip.split('.').forEach(octet => {
            ipl <<= 8;
            ipl += parseInt(octet, 10);
        });

        return ipl >>> 0;
    }

    long2ip(ipl) {
        return (ipl >>> 24) + '.' + (ipl >> 16 & 255) + '.' + (ipl >> 8 & 255) + '.' + (ipl & 255);
    }

    // Event handlers

    onClose = () => {
        this.connected = false;
    };

    onMessage = ({ data }) => {
        data = new DataView(data);

        switch (data.getUint8(0)) {
            case 0: {
                const users = [];
                const byteLength = 1 + 10 + 4 + 2;

                let index = 1;

                for (let i = 0, l = (data.byteLength - 1) / byteLength; i < l; i++) {
                    const id = data.getUint8(index).toString();
                    const nickname = this.decoder.decode(data.buffer.slice(index + 1, index + 11)).replace(/\0/g, '');
                    const remoteAddress = this.long2ip(data.getUint32(index + 11));
                    const latency = data.getUint16(index + 15);

                    users.push({ id, nickname, remoteAddress, latency });

                    index += byteLength;
                }

                this.emit('users', { users });
                break;
            }
            case 1: {
                const id = data.getUint8(1).toString();
                const time = Number(data.getBigInt64(2));

                this.emit('heartbeat', { id, time });

                this.send(data);
                break;
            }
            case 3: {
                const id = data.getUint8(1).toString();
                const isDown = !!data.getUint8(2);
                const x = data.getFloat32(3);
                const y = data.getFloat32(7);

                this.emit('motion', { id, isDown, x, y });
                break;
            }
        }
    };

    onUsers = ({ users }) => {
        store.users = users;

        Stage.events.emit('update', users);
    };

    onHeartbeat = ({ id/* , time */ }) => {
        if (!this.connected) {
            this.connected = true;
            // this.id = id;

            store.id = id;

            if (Number(id) === numPointers) {
                store.observer = true;
            }

            this.nickname(store.nickname);

            this.resolve();
        }
    };

    // Public methods

    nickname = text => {
        const view = this.views[2];
        view.setUint8(0, 2);
        // view.setUint8(1, this.id); // Set server-side

        const buf = this.encoder.encode(text);

        for (let i = 0; i < 10; i++) {
            view.setUint8(2 + i, buf[i]);
        }

        this.send(view);
    };

    motion = ({ isDown, x, y }) => {
        const view = this.views[3];
        view.setUint8(0, 3);
        // view.setUint8(1, this.id); // Set server-side
        view.setUint8(2, isDown ? 1 : 0);
        view.setFloat32(3, x);
        view.setFloat32(7, y);

        this.send(view);
    };

    send = view => {
        if (!this.connected) {
            return;
        }

        this.socket.send(view.buffer);
    };

    connect = () => {
        if (this.socket) {
            this.close();
        }

        this.socket = new WebSocket(this.server, ['permessage-deflate']);
        this.socket.binaryType = 'arraybuffer';

        this.addListeners();
    };

    close = () => {
        this.removeListeners();

        this.socket.close();
    };

    ready = () => this.promise;
}
