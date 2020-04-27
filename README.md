---

# MIRO Test task

Тестовое задание для MIRO

Для скачивания можно использовать [degit](https://github.com/Rich-Harris/degit):

```bash
npx degit dvlezhnev/miro-test-task miro-test-task
cd miro-test-task
```

*Необходимо, чтобы [Node.js](https://nodejs.org) был установлен*


## Для начала

Устанавливаем зависимости

```bash
cd miro-test-task
npm install
```

Чтобы посмотреть, как работает модуль отдельно, можно запустить:

```bash
npm run dev
```

По адресу [localhost:10001 ](http://localhost:10001 ) будет доступна страница только с модулем, без дополнительных компонентов.

Демо страница находится [здесь](https://demo-miro-test-task.now.sh/).


## Сборка для продакшена

Запустить сборку можно командой

```bash
npm run build
```

Проект будет собран в папку *dist*

В папке 2 файла: код и стили.

## Подключение

Для использования в проекте реализован только вариант подключения модуля через тэг <script>. Подробнее [тут](https://demo-miro-test-task.now.sh/#start)

```html
<html>
<head>
    ...
    <link rel='stylesheet' href='./emails-input.css'>
    <script src="./emails-input.js"></script>
    ...
</head>
<body>
    ...
    <div id="emails-input"></div>
    ...
</body>
<script src="./script.js"></script>
</html>
```


## Использование

После подключения в глобальной области видимости появится метод

```javascript
window.EmailsInput
```

```javascript
const emailsInput = window.EmailsInput(htmlElement, options);
```

### Интерфейсы и типы

```typescript
interface IWindowExtendedWithEmailsInput extends Window {
    EmailsInput: EmailInputFactory;
}

type EmailInputFactory = (htmlElement: HTMLElement|string, options?: Partial<IEmailsInputOptions>) => IEmailsInputApi;

interface IEmailsInputOptions {
    initValue: string | string[];
    onChangeHandler: (data: IChangeEventData) => void;
}

interface IChangeEventData {
    added: string[];
    removed: string[];
    emails: string[];
} 

interface IEmailsInputApi {
    /**
     * Заменяет все введённые e-mail'ы указанными
     * @param {string|string[]} emails - E-mail(ы), которые нужно вставить
     */
    set(emails: string | string[]): void;

    /**
     * Добавляет e-mail(ы)
     * @param {string|string[]} emails - новый e-mail
     */
    add(emails: string | string[]): void;

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

/**
 * Метод для отписки от изменения состояния
 */
type Unsubscriber = () => void;
```

*По-хорошему, должен существовать метод **dispose** или **remove** для удаления экземпляра, но я его не сделал :)*

*В задумке, метод add должен игнорировать добавления email'а, который уже есть*

*При инициализации с хэндлером должен быть нормальный способ избавиться от этого хэндлера*

```javascript
// workaround для отписки от изменений при инициализации с хэндлером
let handler = (data) => {console.log(data)};

let emailsInput = EmailsInput("#emails-input", {
    onChangeHandler: handler
});

// Отписку можно сделать так
emailsInput.addChangeHandler(handler)();
```



### Примеры использования

##### Инициализация без параметров [демо](https://demo-miro-test-task.now.sh/#default)

```javascript
let emailsInput = EmailsInput("#emails-input");
```

##### Инициализация со значением  [демо](https://demo-miro-test-task.now.sh/#init1)

```javascript
let emailsInput = EmailsInput("#emails-input", {
    initValue: ["valid.email@example.com", "invalid.email"]
});
```

##### Инициализация с хэндлером изменений [демо](https://demo-miro-test-task.now.sh/#init2)

```javascript
let emailsInput = EmailsInput("#emails-input", {
    initValue: ["valid.email@example.com", "invalid.email"],
    onChangeHandler: console.log
});
```

##### API метод add [демо](https://demo-miro-test-task.now.sh/#add)

```javascript
let emailsInput = EmailsInput("#emails-input", {
    initValue: ["valid.email@example.com", "invalid.email"],
    onChangeHandler: console.log
});

let button1 = document.getElementById("button1");
button1.addEventListener("click", function() {
    emailsInput.add("test1@example.com");
});
let button2 = document.getElementById("button2");
button1.addEventListener("click", function() {
    emailsInput.add(["test2@example.com", "test3.invalid.example.com"]);
});
```

##### API метод set [демо](https://demo-miro-test-task.now.sh/#set)

```javascript
let emailsInput = EmailsInput("#emails-input", {
    initValue: ["valid.email@example.com", "invalid.email"],
    onChangeHandler: console.log
});

let button1 = document.getElementById("button1");
button1.addEventListener("click", function() {
    emailsInput.set("test1@example.com");
});
let button2 = document.getElementById("button2");
button1.addEventListener("click", function() {
    emailsInput.set(["test2@example.com", "test3.invalid.example.com"]);
});
```

##### API метод addChangeHandler [демо](https://demo-miro-test-task.now.sh/#addChangeHandler)

```javascript
let emailsInput = EmailsInput("#emails-input", {
    initValue: ["valid.email@example.com", "invalid.email"]
});
let unsubscribe;

let button1 = document.getElementById("subscribe");
button1.addEventListener("click", function() {
    unsubscribe = emailsInput.addChangeHandler(function(data) {
        alert(JSON.stringify(data, null, 2));
    });
});
let button2 = document.getElementById("unsubscribe");
button2.addEventListener("click", function() {
    if (unsubscribe) unsubscribe();
    unsubscribe = undefined;
});
```

##### API свойства [демо](https://demo-miro-test-task.now.sh/#props)

```javascript
let emailsInput = EmailsInput("#emails-input", {
    initValue: ["valid.email@example.com", "invalid.email"]
});

emailsInput.emails; //Все введённые значения
emailsInput.validEmails; //Все валидные значения
emailsInput.invalidEmails; //Все невалидные значения
```

