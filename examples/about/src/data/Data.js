import { Socket } from './Socket.js';

import { numPointers, store } from '../config/Config.js';

export class Data {
    static init() {
        this.Socket = new Socket();
    }

    // Public methods

    static getUser = id => {
        return store.users.find(item => item.id === id);
    };

    static getUserData = id => {
        const data = this.getUser(id);

        if (!data) {
            return;
        }

        return {
            id: data.id,
            nickname: data.nickname || (Number(data.id) === numPointers ? 'Observer' : data.id),
            // remoteAddress: data.remoteAddress,
            latency: data.latency
        };
    };

    static getReticleData = id => {
        const data = this.getUser(id);

        if (!data) {
            return;
        }

        return {
            // primary: data.nickname || data.remoteAddress,
            primary: data.nickname || data.id,
            secondary: `${data.latency}ms`
        };
    };
}
