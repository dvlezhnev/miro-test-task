import {EmailCollectionEvents, IEmailCollection, IEmailElement} from "./interfaces";
import {SimpleEventEmitter} from "../utils/SimpleEventEmitter";

export class EmailCollection extends SimpleEventEmitter<EmailCollectionEvents> implements IEmailCollection {
    protected _emails = new Set<IEmailElement>();

    constructor() {
        super();

        this.bindSelf();
    }

    public get emails(): string[] {
        return [...this._emails].map(emails => emails.text);
    }

    public get values(): Set<IEmailElement> {
        return this._emails;
    }

    public add(emails: IEmailElement[]): void {
        emails.forEach(email => {
            email.on("remove", this.onRemoveHandler);
            this._emails.add(email);
        });

        this.emit("change", {
            added: emails.map(email => email.text),
            removed: [],
            emails: this.emails
        });
    }

    public set(emails: IEmailElement[]): void {
        let removed = [];
        for (let email of this._emails.values()) {
            email.off("remove", this.onRemoveHandler);
            email.remove();
            removed.push(email.text);
        }
        this._emails.clear();
        emails.forEach(email => {
            email.on("remove", this.onRemoveHandler);
            this._emails.add(email);
        });

        this.emit("change", {
            added: emails.map(email => email.text),
            removed,
            emails: this.emails
        });
    }

    protected bindSelf(): void {
        this.onRemoveHandler = this.onRemoveHandler.bind(this);
    }

    protected onRemoveHandler(email: IEmailElement): void {
        this._emails.delete(email);
        email.off("remove", this.onRemoveHandler);
        this.emit("change", {
            added: [],
            removed: [email.text],
            emails: this.emails
        });
    }
}
