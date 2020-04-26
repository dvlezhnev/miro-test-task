import {IEventEmitter} from "../utils/interfaces";

export type EmailCollectionEvents = "change";
export interface IChangeEventData {
    added: string[];
    removed: string[];
    emails: string[];
}
export interface IEmailCollection extends IEventEmitter<EmailCollectionEvents> {
    emails: string[];
    add(emails: IEmailElement[]): void;
    set(emails: IEmailElement[]): void;
}

export type InputControllerEvents = "data";
export interface IInputController extends IEventEmitter<InputControllerEvents> {}

export type EmailElementEvents = "remove";
export interface IEmailElement extends IEventEmitter<EmailElementEvents> {
    text: string;
    isValid: boolean;
    remove(): void;
}
