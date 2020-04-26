import {IChangeEventData} from "./logic/interfaces";
import {Unsubscriber} from "./utils/interfaces";

export type EmailInputFactory = (htmlElement: HTMLElement|string, options: Partial<IEmailsInputOptions>) => IEmailsInputApi;

export interface IEmailsInputApi {
    /**
     * Зменяет все введённые e-mail'ы указанными
     * Если в новом списки присутствуют уже существующие
     * @param {string|string[]} emails - E-mail(ы) которые нужно вставить
     * @param {boolean} [forceReplace=true] - Если true, то заменяются все, даже одинаковые
     */
    set(emails: string | string[], forceReplace: boolean): void;

    /**
     * Добавляет e-mail(ы)
     * @param {string|string[]} emails - новый e-mail
     * @param {boolean} [force=true] - добавляет новые email, даже если такой уже есть
     */
    add(emails: string | string[], force: boolean): void;

    /**
     * Список всех введённых e-mail'ов
     */
    emails: string[];

    /**
     * Список только валидных e-mail'ов
     */
    validEmails: string[];

    /**
     * Список только невалидных e-mail'ов
     */
    invalidEmails: string[];

    /**
     * Добавляет подписку на событие изменения
     */
    addChangeHandler(cb: (data: IChangeEventData) => void): Unsubscriber;
}

export interface IEmailsInputOptions {
    initValue: string | string[];
    onChangeHandler: (data: any) => void;
}
