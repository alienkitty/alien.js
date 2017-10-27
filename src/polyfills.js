/**
 * @author Patrick Schroen / https://github.com/pschroen
 */

if (typeof Promise !== 'undefined') Promise.create = function () {
    let resolve,
        reject,
        promise = new Promise(function (res, rej) {
            resolve = res;
            reject = rej;
        });
    promise.resolve = resolve;
    promise.reject = reject;
    return promise;
};

Array.prototype.findAndRemove = function (reference) {
    let index = this.indexOf(reference);
    if (index > -1) return this.splice(index, 1);
};
