import { Global } from '../config/Global.js';
import { Socket } from './Socket.js';

export class Data {
    static init() {
        this.Socket = new Socket();
    }

    /**
     * Public methods
     */

    static getUser = id => {
        for (let i = 0, l = Global.USERS.length; i < l; i++) {
            if (Global.USERS[i].id === id) {
                return Global.USERS[i];
            }
        }

        return null;
    };
}
