/**
 * @author Tom Neutens <tomneutens@gmail.com>
 */

import { LitElement, css, html, CSSResultGroup } from "lit";
import {customElement, property, state} from 'lit/decorators.js';
import { store } from "../../state/store"
import { msg } from '@lit/localize';
import { connect } from "pwa-helpers"
import { getGoogleMateriaIconsLinkTag } from "../../util"
import {deleteClassGroup} from "../../state/features/class_group_slice"

import "@material/mwc-button"
import "@material/mwc-dialog"

@customElement("dwengo-classes-list-element")
class ClassListElement extends connect(store)(LitElement) {
    @property({type: String}) name: string = "";
    @property({type: String}) description: string = "";
    @property({type: String}) sharingCode: string = "";
    @property({type: String}) uuid: string = "";
    @property({type: Boolean}) header: boolean = false;

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
        store.dispatch(deleteClassGroup(this.uuid))
        this.showConfirmDialog = false;
    }

    handleList(){

    }

    renderButtons(){
        return html`
        <mwc-button class="item" @click=${this.handleDelete} raised>
            <span class="material-symbols-outlined">
                delete
            </span>
        </mwc-button>
        <a class="no-decoration" href="/dashboard/class/${this.uuid}">
            <mwc-button class="item" raised>
                <span class="material-symbols-outlined">
                    list
                </span>
            </mwc-button>
        </a>`
    }

    renderEmptySpace() {
        return html`<div class="empty_space"></div>`
    }

    renderConfirmDialog(){
        return html`
        <mwc-dialog open="${this.showConfirmDialog}">
            <div>
                ${msg("Are you sure you want to delete the item ")}<em>${this.name}</em>?
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
        <div class="container">
            <span class="item name">${this.name}</span>
            <span class="item description">${this.description}</span>
            <span class="item sharingCode">${this.sharingCode}</span>
            ${this.header ? this.renderEmptySpace() : this.renderButtons()}
        </div>
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
        flex-wrap: wrap;
        background-color: inherit;
        padding: 5px 0;
    }
    mwc-button {
        --mdc-theme-primary: var(--theme-accentFillSelected);
    }
    .description {
        flex-grow: 5;
    }
    .item {
        margin: 2px 5px;
    }
    .name {
        min-width: 150px;
    }
    .sharingCode {
        min-width: 100px;
    }
    .empty_space {
        display: inline-block;
        width: 148px;
    }
    .no-decoration {
        text-decoration: none;
    }
    `

}

export default ClassListElement