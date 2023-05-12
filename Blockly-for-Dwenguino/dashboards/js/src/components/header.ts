/**
 * @author Tom Neutens <tomneutens@gmail.com>
 */

import { LitElement, css, html, CSSResultGroup } from "lit";
import {customElement, state} from 'lit/decorators.js';
import { store } from "../state/store"
import { Unsubscribe } from "redux";
import { msg } from '@lit/localize';
import { connect } from "pwa-helpers"

import "./user/login"


@customElement("dwengo-header")
class Header extends connect(store)(LitElement) {
    static styles?: CSSResultGroup = css`
        :host {
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            min-height: 75px;
            padding: 0 30px;
            background-color: var(--theme-neutralFocusInnerAccent);
        }
        .dwengo-header-logo {
            display: inline-block;
            padding-top: 0.3125rem;
            padding-bottom: 0.3125rem;
            margin-right: 1rem;
            font-size: 1.25rem;
            line-height: inherit;
            white-space: nowrap;
            height: auto;
            max-width: 150px;
        }
        .navbar-brand {
            display: inline-block;
            padding-top: 0.3125rem;
            padding-bottom: 0.3125rem;
            margin-right: 1rem;
        }
    `

    constructor(){
        super();
        
    }


    protected render() {
        console.log(globalThis)
        return html`
            <a class="navbar-brand" href="${globalSettings.hostname}/dashboard"><img class='dwengo-header-logo' src="${globalSettings.hostname}/dashboard/assets/img/components/shared/dwengo-groen-zwart.svg"/></a>
            <dwengo-login-menu></dwengo-login-menu>
        `
    }
}

export default Header