import {IMainContainerUIComponent, IEmailUIComponent, IInputUIComponent} from "../interfaces";
import {UIComponent} from "../UIComponent";

const NAMESPACE_CSS_CLASS = "dvlezhnev-emails-input-component";
const CONTAINER_CSS_CLASS = "container";

export class MainContainerComponent extends UIComponent implements IMainContainerUIComponent {
    protected container: HTMLElement;
    protected input: IInputUIComponent;

    constructor() {
        super();
    }

    public addEmail(emailComponent: IEmailUIComponent): void {
        this.container.insertBefore(emailComponent.getHTMLElement(), this.input.getHTMLElement());
    }

    public addInput(inputComponent: IInputUIComponent): void {
        if (!this.input)
        {
            this.input = inputComponent;
            this.container.appendChild(inputComponent.getHTMLElement());
        }
    }

    public pinTo(element: HTMLElement): void {
        element.replaceWith(this.htmlElement);
    }

    protected createComponent(): void {
        let root = this.createRootContainer();
        let container = this.createEmailsContainer();

        root.appendChild(container);

        this.htmlElement = root;
        this.container = container;
    }

    protected createRootContainer(): HTMLElement {
        let root = document.createElement("div");
        root.classList.add(NAMESPACE_CSS_CLASS);

        return root;
    }

    protected createEmailsContainer(): HTMLElement {
        let container = document.createElement("div");
        container.classList.add(CONTAINER_CSS_CLASS);

        return container;
    }

    protected clickHandler(event: Event): void {
        this.input.focus();
        event.preventDefault();
        event.stopPropagation();
    }

    protected bindSelf(): void {
        this.clickHandler = this.clickHandler.bind(this);
    }

    protected bindEvents(): void {
        this.container.addEventListener("click", this.clickHandler);
    }

    protected unbindEvents(): void {
        this.container.removeEventListener("click", this.clickHandler);
    }

}
