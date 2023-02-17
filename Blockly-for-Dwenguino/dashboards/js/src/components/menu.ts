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
    @state() visible: boolean = false;

    userInfo: UserInfo = initialUserState
    menuItemOptions: Record<string, MenuItem[]> = {
        "user": [
            {label: msg("Home"), href: `${globalSettings.hostname}/dashboard/home`, icon: "home"},
            {label: msg("Profile"), href: `${globalSettings.hostname}/dashboard/profile`, icon: "person"}
        ],
        "student": [],
        "teacher": [
            {label: msg("Class groups"), href: `${globalSettings.hostname}/dashboard/classes`, icon: "groups"},
        ],
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
                return html`<a href="${item.href}" @click=${()=>{this.visible = false}}><li><span class="material-symbols-outlined menu-logo">${item.icon}</span><span class="item-label">${item.label}</span></li></a>`
            })}
        </ul>`
    }

    static styles?: CSSResultGroup = css`
        :host {
            background-color: transparent;
            display: flex;
            flex-direction: column;
            align-items: stretch;
            position: absolute;
        }
        ul.show {
            visibility: visible;
            content-visibility: visible;
        }
        ul.hide {
            visibility: hidden;
            content-visibility: hidden;
        }
        ul {
            display: flex;
            flex-direction: column;
            justify-content: flex-end;
            white-space: nowrap;
            overflow: hidden;
            margin: 0;
            padding: 0;
            margin-top: calc(var(--theme-base-font-size) + 1rem);
            z-index:50;
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
            font-size: var(--theme-base-font-size);
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
            font-size: var(--theme-base-font-size);
        }
        li:hover{
            background-color: var(--theme-accentFillHover);
        }

        
    `
}


export default Menu