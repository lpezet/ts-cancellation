
export interface CancellationTokenSubscription {
    unsubscribe(): void;
}

var emptySubscription: CancellationTokenSubscription = Object.freeze({ unsubscribe(): void { } });

export class CancellationToken {
    private static _none: CancellationToken;
    private _source?: CancellationTokenSource;

    constructor(source?: CancellationTokenSource) {
        this._source = source;
        Object.freeze(this);
    }

    public static get none(): CancellationToken {
        if (!CancellationToken._none) {
            CancellationToken._none = new CancellationToken(undefined);
        }
        return CancellationToken._none;
    }

    public get canBeCanceled(): boolean {
        return !!this._source && !Object.isFrozen(this._source);
    }

    public get canceled(): boolean {
        if (!this._source) {
            return false;
        }
        return (<any>this._source)._canceled;
    }

    public get reason(): any | undefined {
        if (!this._source) {
            return undefined;
        }
        return (<any>this._source)._reason;
    }

    public throwIfCanceled(reason: any = this.reason): void {
        if (!this._source) {
            return;
        }
        if (this.canceled) {
            throw reason;
        }
    }


    public subscribe(callback: (reason: any) => void): CancellationTokenSubscription {
        if (typeof callback !== "function") {
            throw new TypeError("rgument is not a function object.");
        }
        if (!this._source) {
            return emptySubscription;
        }
        return (this._source).subscribe(callback);
    }

}

export class CancellationTokenSource {
    //private static _canceled: CancellationTokenSource;
    private _callbacks: Array<(reason: any) => void>;
    private _links: Array<CancellationTokenSubscription>;
    private _token: CancellationToken;
    private _canceled: boolean;
    private _reason: any;

    constructor(links?: CancellationToken[]) {
        this._token = new CancellationToken(this);
        Object.defineProperty(this, "_token", { writable: false, configurable: false });
        this._callbacks = new Array<(reason: any) => void>();
        this._links = new Array<CancellationTokenSubscription>();
        this._canceled = false;

        if (links) {
            for (var i = 0, l = links.length; i < l; i++) {
                var link = links[i];
                if (!link) {
                    continue;
                }
                if (link.canceled) {
                    this._canceled = true;
                    this._reason = link.reason;
                    return;
                }
                this._links.push(link.subscribe(reason => {
                    this.cancel(reason);
                }));
            }
        }
    }

    public get token(): CancellationToken {
        return this._token;
    }

    public cancel(reason?: any): void {
        if (this._canceled) {
            return;
        }
        this._canceled = true;
        this._throwIfFrozen();
        if (reason == null) {
            reason = new Error("operation was canceled.");
        }
        if (reason instanceof Error && !("stack" in reason)) {
            try {
                throw reason;
            } catch (err) {
                reason = err
            }
        }
        const callbacks = this._callbacks;
        this._reason = reason;
        this._callbacks = [];
        Object.freeze(this);
        if (callbacks) {
            try {
                callbacks.forEach(callback => {
                    callback(reason);
                })
            } finally {
                callbacks.length = 0;
            }
        }
    }

    public close(): void {
        if (Object.isFrozen(this)) {
            return;
        }
        if (this._links) {
            var links = this._links;
            this._links = [];
            links.forEach(l => {
                l.unsubscribe();
            })
        }
    }

    public subscribe(callback: (reason: any) => void): CancellationTokenSubscription {
        if (this._canceled) {
            callback(this._reason);
            return emptySubscription;
        }
        if (Object.isFrozen(this)) {
            return emptySubscription;
        }
        const callbacks = this._callbacks;
        const index = callbacks.push(callback) - 1;
        return Object.freeze({
            unsubscribe() {
                //const index = callbacks.indexOf(callback, 0);
                //if (index >= 0) {
                callbacks.splice(index, 1);
                //}
            }
        })
    }

    private _throwIfFrozen(): void {
        if (Object.isFrozen(this)) {
            throw new Error("cannot modify a frozen object.");
        }
    }
}