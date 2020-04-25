export interface IEventEmitter<T> {
    on(event: T, cb: (data: any) => any): Unsubscriber;
    off(event: T, cb: (data: any) => any): void;
}

export type Unsubscriber = () => any;
