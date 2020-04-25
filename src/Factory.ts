import {EmailInputFactory, IEmailsInputApi} from "./interfaces";
import {MainContainerComponent} from "./ui/container/MainContainerComponent";
import {EmailCollection} from "./logic/EmailCollection";
import {InputComponent} from "./ui/input/InputComponent";
import {InputController} from "./logic/InputController";
import {EmailElement} from "./logic/EmailElement";
import {EmailComponent} from "./ui/element/EmailComponent";

export const Factory: EmailInputFactory = function factory(htmlElement, _options): IEmailsInputApi {

    if (typeof htmlElement === "string")
        (htmlElement as any as HTMLElement | null) = document.querySelector(htmlElement);

    if (!(htmlElement instanceof HTMLElement))
        throw new Error("Can't create EmailInput");

    let mainContainerComponent = new MainContainerComponent(),
        collection = new EmailCollection();

    let inputUI = new InputComponent(),
        inputController = new InputController(inputUI);

    const newDataHandler = (data: string[]) => {
        let emails = data.map(email => new EmailElement(email.toString()));
        collection.add(emails);
        emails.forEach(email => mainContainerComponent.addEmail(new EmailComponent(email)));
    }

    mainContainerComponent.addInput(inputUI);
    inputController.on("data", newDataHandler);

    mainContainerComponent.pinTo(htmlElement);

    return new class implements IEmailsInputApi {
        get emails(): string[] {
            return collection.emails;
        }

        get invalidEmails(): string[] {
            return [...collection.values].filter(email => !email.isValid).map(email => email.text);
        }

        get validEmails(): string[] {
            return [...collection.values].filter(email => email.isValid).map(email => email.text);
        }

        add(data: any, _force: boolean = true): void {
            if (!Array.isArray(data) && typeof data !== "string")
                throw new TypeError("First argument must be string|string[]");

            if (typeof data === "string")
                data = [data];

            newDataHandler(data);
        }

        set(data: any, _forceReplace: boolean = true): void {
            if (!Array.isArray(data) && typeof data !== "string")
                throw new TypeError("First argument must be string|string[]");

            if (typeof data === "string")
                data = [data];

            let emails = (data as string[]).map(email => new EmailElement(email.toString()));
            collection.set(emails);
            emails.forEach(email => mainContainerComponent.addEmail(new EmailComponent(email)));
        }
    }
}
