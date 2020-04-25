export interface IUIComponent {
    getHTMLElement(): HTMLElement;
    remove(): void;
}

export interface IMainContainerUIComponent extends IUIComponent {
    addInput(inputComponent: IInputUIComponent): void;
    addEmail(emailComponent: IEmailUIComponent): void;
    pinTo(element: HTMLElement): void;
}

export interface IInputUIComponent extends IUIComponent {
    focus(): void;
}

export interface IEmailUIComponent extends IUIComponent {

}
