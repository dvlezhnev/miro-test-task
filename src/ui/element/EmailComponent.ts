import {UIComponent} from "../UIComponent";
import {IEmailUIComponent} from "../interfaces";
import {IEmailElement} from "../../logic/interfaces";

const ROOT_ELEMENT_CLASS = "email-component";
const INVALID_CLASS = "invalid";
const TEXT_ELEMENT_CLASS = "text";
const BUTTON_TEXT = "&times";

export class EmailComponent extends UIComponent implements IEmailUIComponent {
    protected text: HTMLElement;
    protected button: HTMLElement;

    constructor(protected email: IEmailElement) {
        super();

        if (!this.email.isValid)
            this.htmlElement.classList.add(INVALID_CLASS);

        this.text.textContent = email.text;
        this.email.on("remove", this.externalRemoveHandler);
    }

    protected createComponent(): void {
        this.htmlElement = this.createRootContainer();
        this.button = this.createButtonComponent();
        this.text = this.createTextComponent();

        this.htmlElement.appendChild(this.text);
        this.htmlElement.appendChild(this.button);
    }

    protected createRootContainer(): HTMLElement {
        let root = document.createElement("span");
        root.classList.add(ROOT_ELEMENT_CLASS);

        return root;
    }

    protected createTextComponent(): HTMLElement {
        let text = document.createElement("span");
        text.classList.add(TEXT_ELEMENT_CLASS);

        return text;
    }

    protected createButtonComponent(): HTMLElement {
        let button = document.createElement("button");
        button.innerHTML = BUTTON_TEXT;

        return button;
    }

    protected _remove(this: any): void {
        this.button.remove();
        this.button = undefined;
        this.text.remove();
        this.text = undefined;

        this.email = undefined;
    }

    protected externalRemoveHandler(): void {
        this.remove();
    }

    protected removeClickHandler(): void {
        this.email.off("remove", this.externalRemoveHandler);
        this.email.remove();
        this.remove();
    }

    protected bindSelf(): void {
        this.externalRemoveHandler = this.externalRemoveHandler.bind(this);
        this.removeClickHandler = this.removeClickHandler.bind(this);
    }

    protected bindEvents(): void {
        this.button.addEventListener("click", this.removeClickHandler);
    }

    protected unbindEvents(): void {
        this.email.off("remove", this.externalRemoveHandler);
        this.button.removeEventListener("click", this.removeClickHandler);
    }
}
