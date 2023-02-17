/**
 * @author Tom Neutens <tomneutens@gmail.com>
 */

import { LitElement, css, html, CSSResultGroup } from "lit";
import {customElement, property, state} from 'lit/decorators.js';
import { msg } from '@lit/localize';
import { getGoogleMateriaIconsLinkTag } from "../../util"

import "@material/mwc-button"
import "@material/mwc-dialog"

@customElement("dwengo-deletable-list-element")
class DeletableListItem extends LitElement {
    @property({type: Array}) fields: string[] = [];
    @property({type: String}) uuid: string = "";
    @property({type: Array}) button_icons: string[] = ["delete", "list"]
    @property({type: Boolean}) header: boolean = false

    @state() showConfirmDialog: boolean = false;

    constructor(){
        super()
    }

    stateChanged(state: any) {

    }

    handleDelete(){
        this.showConfirmDialog = true;
    }

    handleDialogConfirm(){
        const event = new CustomEvent( 'dwengo-list-item-delete', {
            bubbles: true,
            composed: true,
            detail: {
                uuid: this.uuid
            }
        })
        this.showConfirmDialog = false;
        this.dispatchEvent(event)
    }

    handleList(){
        const event = new CustomEvent( 'dwengo-list-item-action', {
            bubbles: true,
            composed: true,
            detail: {
                uuid: this.uuid
            }
        })
        this.dispatchEvent(event)
    }

    renderButtons(){
        return html`
        <span class="button_container">
            <mwc-button class="button ${this.header ? "hidden" : ""}" @click=${this.handleDelete} raised>
                <span class="material-symbols-outlined">
                    ${this.button_icons[0]}
                </span>
            </mwc-button>
            <mwc-button class="button ${this.header ? "hidden" : ""}" @click=${this.handleList} raised>
                <span class="material-symbols-outlined">
                    ${this.button_icons[1]}
                </span>
            </mwc-button>
        </span>`
    }

    renderConfirmDialog(){
        return html`
        <mwc-dialog open="${this.showConfirmDialog}">
            <div>
                ${msg("Are you sure you want to delete the item ")}<em>${this.fields.join(" - ")}</em>?
            </div>
            <mwc-button @click="${() => {this.handleDialogConfirm()}}" slot="primaryAction" dialogAction="close">
                ${msg("Yes")}
            </mwc-button>
            <mwc-button @click="${() => {this.showConfirmDialog = false}}" slot="secondaryAction" dialogAction="close">
                ${msg("Cancel")}
            </mwc-button>
        </mwc-dialog>
        `
    }

    protected render(): unknown {
        return html`
        ${getGoogleMateriaIconsLinkTag()}
        <tr class="container ${this.header ? "tableheader" : ""}">
            ${this.fields?.map(field => {
                return html`<td class="item">${field}</td>`
            })} 
            ${this.renderButtons()}
        </tr>
        ${this.showConfirmDialog ? this.renderConfirmDialog() : ""}
        `
    }

    static styles?: CSSResultGroup = css`
    :host {
        background-color: inherit;
        padding: 5px 0;
    }
    .container {
        width: 100%;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        background-color: inherit;
        padding: 5px 0;
    }
    mwc-button {
        --mdc-theme-primary: var(--theme-accentFillSelected);
    }
    .item {
        margin: 2px 5px;
        overflow-x: hidden; 
        white-space: nowrap;
        min-width: 60px;
    }
    .button {
        margin: 2px 5px;
    }
    .item:nth-of-type(2){
        flex-grow: 5;
    }
    .item:nth-of-type(odd){
    }
    .no-decoration {
        text-decoration: none;
    }
    .button_container {
        display: flex;
        flex-direction: row;
    }
    .hidden {
        visibility: hidden;
    }
    .tableheader {
        background-color: var(--theme-accentFillSelected);
        color: var(--theme-white);
        padding: 0px 2px;
    }
    `

}

export default DeletableListItem