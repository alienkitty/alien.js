import { Socket } from './Socket.js';

import { store } from '../config/Config.js';

export class Data {
    static init() {
        this.Socket = new Socket();
    }

    // Public methods

    static getUser = id => {
        return store.users.find(item => item.id === id);
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
