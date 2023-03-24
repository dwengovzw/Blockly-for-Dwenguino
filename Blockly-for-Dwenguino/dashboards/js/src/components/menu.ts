import { LitElement, css, html, CSSResultGroup } from "lit";
import { customElement, state, property } from "lit/decorators.js"; // needs .js to transpile
import { store } from "../state/store"
import { msg } from '@lit/localize';
import { connect } from "pwa-helpers"
import { UserInfo, initialUserState } from "../state/features/user_slice"
import { getGoogleMateriaIconsLinkTag } from "../util"

import '@vaadin/app-layout';
import '@vaadin/app-layout/vaadin-drawer-toggle';
import '@vaadin/icon';
import '@vaadin/icons';
import '@vaadin/tabs';
import '@vaadin/progress-bar';

interface MenuItem {
    id: string,
    label: string,
    href: string,
    icon?: string,
    external: boolean
}

@customElement("dwengo-menu")
class Menu extends connect(store)(LitElement){
    @state() menuItems:MenuItem[] = []
    @state() visible: boolean = false
    @state() loading: boolean = false

    @property() selectedId: string = "home"

    userInfo: UserInfo = initialUserState
    menuItemOptions: Record<string, MenuItem[]> = {
        "all": [
            {id: "home", label: msg("Home"), href: `${globalSettings.hostname}/dashboard/home`, icon: "home", external: false},
            {id: "simulator", label: msg("Simulator"), href: `${globalSettings.hostname}`, icon: "code", external: true},
        ],
        "user": [
            {id: "profile", label: msg("Profile"), href: `${globalSettings.hostname}/dashboard/profile`, icon: "person", external: false},
            {id: "savedprograms", label: msg("Saved programs"), href: `${globalSettings.hostname}/dashboard/savedprograms`, icon: "folder_open", external: false},
            {id: "portfolios", label: msg("Portfolios"), href: `${globalSettings.hostname}/dashboard/portfolios`, icon: "menu_book", external: false},
        ],
        "student": [
            {id: "studentclassgroups", label: msg("Class groups"), href: `${globalSettings.hostname}/dashboard/studentclasses`, icon: "groups", external: false},
        ],
        "teacher": [
            {id: "classgroups", label: msg("Class groups"), href: `${globalSettings.hostname}/dashboard/classes`, icon: "groups", external: false},
        ],
        "admin": []
    }
    
    constructor(){
        super()
    }

    stateChanged(state: any): void {
        this.userInfo = state.user
        let newMenuItems: MenuItem[] = []
        newMenuItems.push(...this.menuItemOptions["all"]) // Add items you can see without being logged in.
        for (let role of this.userInfo?.roles){
            newMenuItems.push(...this.menuItemOptions[role])
        }
        this.menuItems = newMenuItems
        this.loading = state.notification.loading
    }

    protected override render() {
        return html`
          ${getGoogleMateriaIconsLinkTag()}
          <vaadin-app-layout .drawerOpened=${true}>
            <vaadin-drawer-toggle slot="navbar"></vaadin-drawer-toggle>
            <h1 slot="navbar" class="header">
                <img class='dwengo-header-logo' src="${globalSettings.hostname}/dashboard/assets/img/components/shared/dwengo-groen-zwart.svg"/>
                <dwengo-login-menu></dwengo-login-menu>
                ${this.loading ? html`<vaadin-progress-bar indeterminate></vaadin-progress-bar>` : ""}
            </h1>
            
            <vaadin-tabs slot="drawer" orientation="vertical" selected=${this.menuItems.map(item => item.id).indexOf(this.selectedId)}>
                ${this.menuItems.map(item => {
                    return html`
                    <vaadin-tab>
                        <a tabindex="-1" href="${item.href}" rel="${item.external ? "external" : "next"}">
                            <span class="material-symbols-outlined menu-logo">${item.icon}</span>
                            <span class="item-label">${item.label}</span>
                        </a>
                    </vaadin-tab>
                    `
                })}
            </vaadin-tabs>
            <div class="main_page">
                <slot></slot>
            </div>
          </vaadin-app-layout>
        `;
      }


    static override styles = css`
        .main_page {
            margin: 1rem auto;
            width: 90%;
            max-width: 1366px;
        }

        h1 {
        font-size: var(--lumo-font-size-l);
        margin: 0;
        }

        .menu-logo {
        box-sizing: border-box;
        margin-inline-end: var(--lumo-space-m);
        margin-inline-start: var(--lumo-space-xs);
        padding: var(--lumo-space-xs);
        }

        .dwengo-header-logo{
            display: inline-block;
            max-width: 100px;
        }

        vaadin-tab[selected] {
            color: var(--theme-accentFillSelected);
        }

        dwengo-login-menu {
            display: inline-block;
            max-width: 100px;
            margin-right: 20px;
        }

        .header {
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            width: 100%;
        }

        vaadin-app-layout::part(navbar) {
            background-color: var(--theme-neutralFocusInnerAccent);
        }

        vaadin-progress-bar {
            position: absolute;
            width: 100vw;
            left: 0;
            top: 0;
            margin-top: 0;
        }
    `;

}


export default Menu