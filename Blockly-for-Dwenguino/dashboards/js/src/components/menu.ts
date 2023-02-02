import { LitElement, css, html, CSSResultGroup } from "lit";
import { customElement, state } from "lit/decorators.js"; // needs .js to transpile
import { store } from "../state/store"
import { msg } from '@lit/localize';
import { connect } from "pwa-helpers"
import { UserInfo, initialUserState } from "../state/features/user_slice"
import { getGoogleMateriaIconsLinkTag } from "../util"

interface MenuItem {
    label: string,
    href: string,
    icon?: string
}

@customElement("dwengo-menu")
class Menu extends connect(store)(LitElement){
    @state() menuItems:MenuItem[] = []
    @state() visible: boolean = true;

    userInfo: UserInfo = initialUserState
    menuItemOptions: Record<string, MenuItem[]> = {
        "user": [
            {label: msg("Home"), href: "/dashboard/home", icon: "home"},
            {label: msg("Profile"), href: "/dashboard/profile", icon: "person"}
        ],
        "student": [],
        "teacher": [],
        "admin": []
    }
    
    constructor(){
        super()
    }

    stateChanged(state: any): void {
        this.userInfo = state.user
        let newMenuItems: MenuItem[] = []
        for (let role of this.userInfo?.roles){
            newMenuItems.push(...this.menuItemOptions[role])
        }
        this.menuItems = newMenuItems
    }

    protected render() {
        return html`
        ${getGoogleMateriaIconsLinkTag()}
        <span class="hamburger material-symbols-outlined ${this.visible ? "open" : "closed"}" @click=${()=>{this.visible = !this.visible}}>menu</span>
        <ul class="${this.visible ? "show" : "hide"}">
            ${this.menuItems.map((item) => {
                return html`<a href="${item.href}" @click=${()=>{}}><li><span class="material-symbols-outlined menu-logo">${item.icon}</span><span class="item-label">${item.label}</span></li></a>`
            })}
        </ul>`
    }

    static styles?: CSSResultGroup = css`
        :host {
            background-color: var(--theme-neutralFocusInnerAccent);
            display: flex;
            flex-direction: column;
            align-items: stretch;
        }
        @keyframes show {
            from {max-width: 0px;}
            to {max-width: 150px;}
        }
        @keyframes hide { 
            from {max-width: 150px;}
            to { max-width: 0px;  }
        }
        ul.show {
            animation-name: show;
            animation-duration: 1s;
        }
        ul.hide {
            animation-name: hide;
            animation-duration: 1s;  
            max-width: 0px;
        }
        ul {
            display: flex;
            flex-direction: column;
            justify-content: flex-end;
            white-space: nowrap;
            overflow: hidden;
            margin: 0;
            padding: 0;
            margin-top: 2.5rem;
        }
        li {
            overflow: hidden;
            list-style: none;
            box-sizing: border-box;
            margin: 0;
            background-color: var(--theme-accentFillSelected);
            text-align: center;
            padding: 0.5rem 1rem;
            display: flex;
            flex-direction: row;
            align-items: center;
            
        }
        .hamburger {
            background-color: var(--theme-accentFillSelected);
            color: var(--theme-white);
            padding: 0.5rem 1rem;
            font-size: 1.5rem;
            text-align: right;
            position: absolute;
        }
        .hamburger:hover {
            cursor: pointer;
        }
        
        a:visited {
            color: var(--theme-white);
        }
        a {
            color: var(--theme-white);
            text-decoration: none;
        }
        .menu-logo {
            margin-right: 0.5rem;
        }
        li:hover{
            background-color: var(--theme-accentFillHover);
        }

        
    `
}


export default Menu