import "./main.scss";
import {EmailInputFactory} from "./interfaces";
import {InstallPolyfills} from "./utils/Polyfills";
import {Factory} from "./Factory";

interface IWindowExtendedWithEmailsInput extends Window {
    EmailsInput: EmailInputFactory;
}

declare var window: IWindowExtendedWithEmailsInput;

(function main() {
    InstallPolyfills();
    window.EmailsInput = Factory;
})();
