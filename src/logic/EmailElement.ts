import {SimpleEventEmitter} from "../utils/SimpleEventEmitter";
import {EmailElementEvents, IEmailElement} from "./interfaces";
import {EMAIL_CHECK_REGEXP} from "../utils/constants";

export class EmailElement extends SimpleEventEmitter<EmailElementEvents> implements IEmailElement {
    private _isValid: boolean = true;

    constructor(private _text: string) {
        super();
        this.check();
    }

    public get text(): string {
        return this._text;
    }

    public get isValid(): boolean {
        return this._isValid;
    }

    public remove(): void {
        this.emit("remove", this);
    }

    protected check(): void {
        this._isValid = EMAIL_CHECK_REGEXP.test(this._text);
    }

}
