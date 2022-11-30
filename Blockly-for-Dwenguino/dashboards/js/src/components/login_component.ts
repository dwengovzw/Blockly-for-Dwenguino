import { FASTElement, customElement, attr, ValueConverter, html, ViewTemplate, css, ElementStyles, when, observable } from '@microsoft/fast-element';
import axios from "axios";


const elementStyle: ElementStyles = css`
  
`;


const loginTemplate: ViewTemplate<LoginComponent> = html`


  ${when(elem => !elem.loggedIn, html<LoginComponent>`
    <a href="/oauth/login?platform=github"><button id="loginbutton" type="primary"
      className="btn"
      size="lg">
        Login
    </button></a>
  `)}

  ${when(elem => elem.loggedIn, html<LoginComponent>`
    <span>${x => x.username}</span
  `)}
  
  <slot></slot>
`;

@customElement({
    name: 'login-component',
    template: loginTemplate,
    styles: elementStyle
})
export class LoginComponent extends FASTElement {
    @attr loggedIn: boolean = false;
    @attr sessionToken: string = "";
    @attr username: string = "";

    constructor(){
        super();
    }
}