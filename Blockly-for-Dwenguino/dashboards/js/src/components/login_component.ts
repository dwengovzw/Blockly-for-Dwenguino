import { FASTElement, customElement, attr, html, ViewTemplate, css, ElementStyles, when } from '@microsoft/fast-element';


const elementStyle: ElementStyles = css`
  
`;


const loginTemplate: ViewTemplate<LoginComponent> = html`


  ${when(elem => !elem.loggedIn, html<LoginComponent>`
    <a href="/oauth/login?platform=leerId${x => x.originalRequestInfo}"><button id="loginbutton" type="primary"
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
    @attr originalRequestInfo: string = "";

    constructor(){
        super();
        fetch("/user/isLoggedIn").then(async (response) => {
          if (response.status == 200){
            this.loggedIn = true;
            this.username = await response.text();
          } else {
            this.loggedIn = false;
          }
          
        }).catch((e) => {
          console.log(e);
        })
        const params:URLSearchParams = new URLSearchParams(window.location.search);
        let reqInfo:string = params.get("originalRequestInfo")?.toString() as string;
        if (reqInfo){
          this.originalRequestInfo = `&originalRequestInfo=${reqInfo}`
        } 
        
    }

    // optional method called when user is changed
    loggedInChanged(oldValue: boolean, newValue: boolean){
      console.log(newValue);
    }
}