function MyPromise(resolve) {
    this.resolveFunc = function () {
    };
    this.rejectFunc = function () {
    };
    resolve(this.resolve.bind(this), this.reject.bind(this));
}

MyPromise.prototype.resolve = function (val) {
    setTimeout(() => {
        this.resolveFunc(val);
    }, 0);
};

MyPromise.prototype.reject = function (val) {
    setTimeout(() => {
        this.rejectFunc(val);
    }, 0);
};

MyPromise.prototype.then = function (resolve, reject) {
    this.resolveFunc = resolve;
    this.rejectFunc = reject;
    return this;
};

module.exports = {
    _resolveStorage: {},
    _addResolve(eventName, resolve, removeEventAfterTrigger) {
        if (!this._resolveStorage[eventName]) {
            this._resolveStorage[eventName] = [];
        }
        this._resolveStorage[eventName].push({
            resolve: resolve,
            removeEventAfterTrigger: removeEventAfterTrigger,
        });
    },
    /**
     * 定义触发器
     * @param eventName
     * @param removeEventAfterTrigger
     * @returns {Promise<any>}
     */
    on(eventName, removeEventAfterTrigger) {
        return new MyPromise(fn => {
            if (typeof removeEventAfterTrigger === 'undefined') {
                removeEventAfterTrigger = true;
            }
            this._addResolve(eventName, fn, removeEventAfterTrigger);
        });
    },
    /**
     * 触发事件
     * @param eventName
     * @param e 传入数据（可选）
     */
    trigger(eventName, e) {
        if (!this._resolveStorage[eventName] || !this._resolveStorage[eventName].length) {
            return;
        }
        let saveEvens = [];
        for (let i in this._resolveStorage[eventName]) {
            this._resolveStorage[eventName][i].resolve(e);
            if (!this._resolveStorage[eventName][i].removeEventAfterTrigger) {
                saveEvens.push(this._resolveStorage[eventName][i]);
            }
        }
        this._resolveStorage[eventName] = saveEvens;
    },
};
