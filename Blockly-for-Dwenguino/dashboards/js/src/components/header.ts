/**
 * @author Tom Neutens <tomneutens@gmail.com>
 */

import { LitElement, css, html, CSSResultGroup } from "lit";
import {customElement, state} from 'lit/decorators.js';
import { store } from "../state/store"
import { Unsubscribe } from "redux";
import { msg } from '@lit/localize';
import { connect } from "pwa-helpers"
import "./login"



@customElement("dwengo-header")
class Header extends connect(store)(LitElement) {
    static styles?: CSSResultGroup = css`
        :host {
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            height: 75px;
            padding: 0 30px;
            background-color: var(--theme-neutralFocusInnerAccent);
        }
    `


    stateChanged(state: any): void {
        
    }

    constructor(){
        super();
        
    }


    protected render() {
        console.log(globalThis)
        return html`
            <img class='dwengo-header-logo' src="${globalThis.hostname}/dashboard/assets/img/components/shared/dwengo-groen-zwart.svg"/>
            <dwengo-login-menu></dwengo-login-menu>
        `
    }
}

export default Header