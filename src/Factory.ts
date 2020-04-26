import {EmailInputFactory, IEmailsInputApi} from "./interfaces";
import {MainContainerComponent} from "./ui/container/MainContainerComponent";
import {EmailCollection} from "./logic/EmailCollection";
import {InputComponent} from "./ui/input/InputComponent";
import {InputController} from "./logic/InputController";
import {EmailElement} from "./logic/EmailElement";
import {EmailComponent} from "./ui/element/EmailComponent";
import {IChangeEventData, IEmailCollection} from "./logic/interfaces";
import {Unsubscriber} from "./utils/interfaces";
import {IMainContainerUIComponent} from "./ui/interfaces";

export const Factory: EmailInputFactory = function factory(htmlElement, options= {}): IEmailsInputApi {
    if (typeof htmlElement === "string")
        (htmlElement as any as HTMLElement | null) = document.querySelector(htmlElement);

    if (!(htmlElement instanceof HTMLElement))
        throw new Error("Can't create EmailsInput");

    let mainContainerUI = new MainContainerComponent(),
        collection = new EmailCollection();

    let inputUI = new InputComponent(),
        inputController = new InputController(inputUI);

    mainContainerUI.addInput(inputUI);
    inputController.on("data",
        (data: string[]) => addEmails(collection, mainContainerUI, data));

    mainContainerUI.pinTo(htmlElement);

    if (options.onChangeHandler)
        collection.on("change", options.onChangeHandler);

    if (options.initValue)
        addData(collection, mainContainerUI, options.initValue, true);

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
            addData(collection, mainContainerUI, data, _force);
        }

        set(data: any, _forceReplace: boolean = true): void {
            setData(collection, mainContainerUI, data, _forceReplace);
        }

        addChangeHandler(cb: (data: IChangeEventData) => void): Unsubscriber {
            return collection.on("change", cb);
        }
    }
}

function addData(collection: IEmailCollection,
                 containerUI: IMainContainerUIComponent,
                 data: any,
                 _force: boolean = false) {
    addEmails(collection, containerUI, convertDataToStringArray(data));
}

function addEmails(collection: IEmailCollection,
                   containerUI: IMainContainerUIComponent,
                   data: string[]) {
    let emails = data.map(email => new EmailElement(email.toString()));
    collection.add(emails);
    emails.forEach(email => containerUI.addEmail(new EmailComponent(email)));
}

function setData(collection: IEmailCollection,
                 containerUI: IMainContainerUIComponent,
                 data: any,
                 _forceReplace: boolean = true) {
    setEmails(collection, containerUI, convertDataToStringArray(data));
}

function setEmails(collection: IEmailCollection,
                   containerUI: IMainContainerUIComponent,
                   data: string[]) {
    let emails = data.map(email => new EmailElement(email.toString()));
    collection.set(emails);
    emails.forEach(email => containerUI.addEmail(new EmailComponent(email)));
}

function convertDataToStringArray(data: any): string[] {
    if (!Array.isArray(data) && typeof data !== "string")
        throw new TypeError("Data must be string|string[]");

    if (typeof data === "string")
        data = [data];

    return data;
}
