import { FASTElement } from '@microsoft/fast-element';
export declare class NameTag extends FASTElement {
    greeting: string;
    numberOfGreets: number;
    loggedIn: boolean;
    user: any | null;
    constructor();
    handleButtonClick(): void;
    connectedCallback(): void;
    userChanged(oldUser: any, newUser: any): void;
    greetingChanged(): void;
    numberOfGreetsChanged(oldValue: number, newValue: number): void;
}
//# sourceMappingURL=name_tag.d.ts.map