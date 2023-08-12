import { Global } from '../config/Global.js';
import { Socket } from './Socket.js';

export class Data {
    static init() {
        this.Socket = new Socket();
    }

    // Public methods

    static getUser = id => {
        return Global.USERS.find(item => item.id === id);
    };
}
