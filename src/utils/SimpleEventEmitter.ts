import {IEventEmitter, Unsubscriber} from "./interfaces";

export class SimpleEventEmitter<T> implements IEventEmitter<T> {
    protected events: Map<T, Set<(data: any) => void>> = new Map();

    public on(event: T, cb: (data: any) => any): Unsubscriber {
        let cbs = this.events.get(event);
        if (!cbs) {
            cbs = new Set<(data:any) => any>();
            this.events.set(event, cbs);
        }
        cbs.add(cb);

        return () => cbs!.delete(cb);
    }

    public off(event: T, cb: (data: any) => any): void {
        let cbs = this.events.get(event);
        if (!cbs) return;
        cbs.delete(cb);
    }

    protected emit(event: T, data: any): void {
        let cbs = this.events.get(event);
        if (!cbs) return;
        for (let cb of cbs) {
            setTimeout(() => cb(data), 0);
        }
    }
}
