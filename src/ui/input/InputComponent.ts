import {UIComponent} from "../UIComponent";
import {IInputUIComponent} from "../interfaces";

const COMPONENT_CLASS = "input-component";

export class InputComponent extends UIComponent implements IInputUIComponent{
    constructor() {
        super();
    }

    public focus(): void {
        this.htmlElement.focus();
    }

    public get value(): string {
        return this.htmlElement.innerText || "";
    }

    protected createComponent(): void {
        this.htmlElement = document.createElement("span");
        this.htmlElement.classList.add(COMPONENT_CLASS);
        this.htmlElement.contentEditable = "true";
    }

}
