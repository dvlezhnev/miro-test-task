import {IUIComponent} from "./interfaces";

export abstract class UIComponent implements IUIComponent {
    protected htmlElement: HTMLElement;

    constructor() {
        this.bindSelf();
        this.createComponent();
        this.bindEvents();
    }

    public getHTMLElement(): HTMLElement {
        return this.htmlElement;
    }

    public remove(): void {
        this.unbindEvents();
        this._remove();
        if (this.htmlElement) {
            this.htmlElement.remove();
        }
    }

    protected createComponent(): void {}

    protected bindSelf(): void {}

    protected bindEvents(): void {}

    protected unbindEvents(): void {}

    protected _remove(): void {}
}
