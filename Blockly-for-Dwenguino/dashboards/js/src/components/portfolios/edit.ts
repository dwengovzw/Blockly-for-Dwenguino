import { css, CSSResultGroup, html, LitElement } from "lit";
import { store } from "../../state/store"
import { connect } from "pwa-helpers"
import {customElement, property, state} from 'lit/decorators.js';

@customElement("dwengo-edit-dashboard")
class EditDashboard extends connect(store)(LitElement){

    @property() uuid: string = ""

    stateChanged(state: any){
        console.log(state)
    }
    protected render() {
        return html`${this.uuid}`
    }

    static styles?: CSSResultGroup = css`
    `
}