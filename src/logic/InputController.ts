import {SimpleEventEmitter} from "../utils/SimpleEventEmitter";
import {IInputController, InputControllerEvents} from "./interfaces";
import {IInputUIComponent} from "../ui/interfaces";

const IS_IE = /Trident/.test( navigator.userAgent );
const INPUT_EVENT_NAME = IS_IE ? 'textinput' : 'input';

export class InputController extends SimpleEventEmitter<InputControllerEvents> implements IInputController{
    constructor(protected inputComponent: IInputUIComponent) {
        super();

        this.bindSelf();
        this.bindEvents();
    }

    protected get value(): string {
        return this.inputComponent.getHTMLElement().innerText;
    }

    protected parse(data: string): string[] {
        return data.replace(/[\n\s]/gm, ",")
            .split(",")
            .map(el => el.trim())
            .filter(el => !!el);
    }

    protected checkNewData(data: string): void {
        if (data === "") return;

        let parsed = this.parse(data);
        if (parsed.length)
        {
            this.emit("data", parsed);
            this.inputComponent.getHTMLElement().innerText = "";
        }
    }

    protected bindSelf(): void {
        this.onBlur = this.onBlur.bind(this);
        this.onInput = this.onInput.bind(this);
        this.onPaste = this.onPaste.bind(this);
        this.onKeyDown = this.onKeyDown.bind(this);
    }

    protected bindEvents(): void {
        let input = this.inputComponent.getHTMLElement();

        input.addEventListener("blur", this.onBlur);
        input.addEventListener(INPUT_EVENT_NAME, this.onInput);
        input.addEventListener("paste", this.onPaste);
        input.addEventListener("keydown", this.onKeyDown);
    }

    protected unbindEvents(): void {
        let input = this.inputComponent.getHTMLElement();

        input.removeEventListener("blur", this.onBlur);
        input.removeEventListener(INPUT_EVENT_NAME, this.onInput);
        input.removeEventListener("paste", this.onPaste);
        input.removeEventListener("keydown", this.onKeyDown);
    }

    protected onBlur(event: FocusEvent): void {
        this.checkNewData(this.value || "");
        event.preventDefault();
        event.stopPropagation();
    }

    protected onInput(event: Event): void {
        let eventData = (event as InputEvent).data;
        switch (true) {
            case eventData === ",":
            case eventData === " ":
                this.checkNewData(this.value || "");
        }

        event.preventDefault();
        event.stopPropagation();
    }

    protected onPaste(event: ClipboardEvent): void {
        //Заплатка для IE
        let data = event.clipboardData || (window as any).clipboardData;
        if (data)
            this.checkNewData(data.getData("text"));

        event.preventDefault();
        event.stopPropagation();
    }

    protected onKeyDown(event: KeyboardEvent): void {
        if (event.keyCode === 13) {
            this.checkNewData(this.value || "");
            event.preventDefault();
            event.stopPropagation();
        }
    }


}
