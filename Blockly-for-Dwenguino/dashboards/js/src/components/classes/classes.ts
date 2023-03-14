/**
 * @author Tom Neutens <tomneutens@gmail.com>
 */

import { LitElement, css, html, CSSResultGroup } from "lit";
import {customElement, state} from 'lit/decorators.js';
import { store } from "../../state/store"
import { msg } from '@lit/localize';
import { connect } from "pwa-helpers"
import { getGoogleMateriaIconsLinkTag } from "../../util"
import {addClassGroup, ClassGroupInfo, getAllClassGroups, deleteClassGroup} from "../../state/features/class_group_slice"
import { Router, Routes } from "@lit-labs/router"

import "../menu"
import "@material/mwc-textfield"
import "@material/mwc-button"
import "@material/mwc-checkbox"
import "@material/mwc-formfield"
import "@material/mwc-icon"
import "@material/mwc-circular-progress"
import "../util/deletable_list_item"

'@vaadin/button';
import '@vaadin/grid';
import { columnBodyRenderer } from '@vaadin/grid/lit.js';
import "@material/mwc-button"
import '@vaadin/grid/vaadin-grid-sort-column.js';
import "@material/mwc-dialog"


@customElement("dwengo-classes-page")
class Classes extends connect(store)(LitElement) {

    @state() groups: ClassGroupInfo[] = []
    @state() loading: boolean = false;

    @state() newClassName: string = ""
    @state() newClassDescription: string = ""

    @state() showConfirmDialog: boolean = false
    @state() itemSelectedToDelete: ClassGroupInfo | null = null

    private _routes = new Routes(this, [
        {path: '', render: () => this.renderClassesList()},
        {path: '/class/:uuid', name: "classdetails", render: ({uuid}) => this.renderClassDetails(uuid)},
      ]);

    stateChanged(state: any): void {
        console.log(state)
        this.groups = structuredClone(state.classGroup.groups)
        this.loading = state.loading
    }

    constructor(){
        super()
        store.dispatch(getAllClassGroups())
    }

    addClassGroup(){
        let info: ClassGroupInfo = {
            name: this.newClassName,
            description: this.newClassDescription
        }
        this.newClassName = ""
        this.newClassDescription = ""
        store.dispatch(addClassGroup(info))
    }

    handleDeleteClassGroup(uuid){
        store.dispatch(deleteClassGroup(uuid))
        this.showConfirmDialog = false
    }

    handleShowClassGroup(uuid) {
        this._routes.goto(`/class/${uuid}`)
       //window.location.href=`${globalSettings.hostname}/dashboard/class/${uuid}`;
    }

    renderConfirmDialog(name: string | undefined, uuid: string | undefined){
        return html`
        <mwc-dialog open="${this.showConfirmDialog}">
            <div>
                ${msg("Are you sure you want to remove this classgroup: ")}<em>${name}</em>?
            </div>
            <mwc-button @click="${() => {this.handleDeleteClassGroup(uuid)}}" slot="primaryAction" dialogAction="close">
                ${msg("Yes")}
            </mwc-button>
            <mwc-button @click="${() => {this.showConfirmDialog = false}}" slot="secondaryAction" dialogAction="close">
                ${msg("Cancel")}
            </mwc-button>
        </mwc-dialog>
        `
    }

    /*renderClassesList() {
        return html`
            ${getGoogleMateriaIconsLinkTag()}
            <dwengo-deletable-list-element 
                fields="${JSON.stringify([msg("Name"), msg("Description"), msg("Sharing Code")])}"
                header="true"
                class="tableheader">
            </dwengo-deletable-list-element>
            ${this.groups.map((group) => {
                return html`<dwengo-deletable-list-element
                                fields="${JSON.stringify([group.name, group.description, group.sharingCode])}"
                                uuid="${group.uuid}"
                                @dwengo-list-item-delete=${(e) => this.handleDeleteClassGroup(e.detail.uuid)}
                                @dwengo-list-item-action=${(e) => this.handleShowClassGroup(e.detail.uuid)}>
                            </dwengo-deletable-list-element>`})
            }
            <div class="add_menu">
                <mwc-textfield class="item add_name_field" @change=${(e) => this.newClassName = e.target.value } outlined label="${msg("Name")}" type="text" value="${this.newClassName}"></mwc-textfield>
                <mwc-textfield class="item add_description_field" @change=${(e) => this.newClassDescription = e.target.value } outlined label="${msg("Description")}" type="text" value="${this.newClassDescription}"></mwc-textfield>
                <mwc-button class="item" @click=${this.addClassGroup} raised>${msg("Create")}</mwc-button>
            </div>
        `
    }*/


    renderClassesList() {
        return html`
            ${getGoogleMateriaIconsLinkTag()}
            <vaadin-grid .items="${this.groups}">
                <vaadin-grid-sort-column frozen header="${msg("Name")}" auto-width flex-grow="0" path="name"></vaadin-grid-sort-column>
                <vaadin-grid-sort-column flex-grow="1" header="${msg("Description")}" path="description" auto-width></vaadin-grid-sort-column>
                <vaadin-grid-sort-column flex-grow="0" header="${msg("Sharing code")}" path="sharingCode" auto-width></vaadin-grid-sort-column>
                <vaadin-grid-column
                frozen-to-end
                auto-width
                flex-grow="0"
                ${columnBodyRenderer(
                    (classGroup: ClassGroupInfo) => html`
                        <vaadin-button 
                            theme="primary" 
                            class="item" 
                            @click="${() => {this.itemSelectedToDelete = classGroup; this.showConfirmDialog = true}}">
                            <span class="material-symbols-outlined">
                                delete
                            </span>
                        </vaadin-button>`,
                    []
                )}
                ></vaadin-grid-column>
                <vaadin-grid-column
                frozen-to-end
                auto-width
                flex-grow="0"
                ${columnBodyRenderer(
                    (classGroup: ClassGroupInfo) => html`
                        <a href="${globalSettings.hostname}/dashboard/classes/class/${classGroup.uuid}">
                            <vaadin-button 
                                theme="primary" 
                                class="item">
                                <span class="material-symbols-outlined">
                                    info
                                </span>
                            </vaadin-button>
                        </a>`,
                    []
                )}
                ></vaadin-grid-column>
            </vaadin-grid>
            <div class="add_menu">
                <mwc-textfield class="item add_name_field" @change=${(e) => this.newClassName = e.target.value } outlined label="${msg("Name")}" type="text" value="${this.newClassName}"></mwc-textfield>
                <mwc-textfield class="item add_description_field" @change=${(e) => this.newClassDescription = e.target.value } outlined label="${msg("Description")}" type="text" value="${this.newClassDescription}"></mwc-textfield>
                <mwc-button class="item" @click=${this.addClassGroup} raised>${msg("Create")}</mwc-button>
            </div>
            ${this.showConfirmDialog ? this.renderConfirmDialog(this.itemSelectedToDelete?.name, this.itemSelectedToDelete?.uuid) : ""}
        `
    }    

    renderClassDetails(uuid: string | undefined) {
        if (uuid){
            return html`
                <dwengo-class-page uuid="${uuid}"></dwengo-class-page>
            `
        } else {
            return ""
        }
        
    }
    
    protected render() {
        return this._routes.outlet()
    }

    static styles?: CSSResultGroup = css`
        :host {
            flex-grow: 5;
            margin-top: 32px;
        }
        .add_menu {
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: space-between;
            margin-top: 10px;
        }
        .add_menu mwc-button {
            --mdc-theme-primary: var(--theme-accentFillSelected);
            width: 138px;
        }
        .add_menu mwc-textfield {
            --mdc-theme-primary: var(--theme-accentFillSelected);
        }
        .add_name_field {
            min-width: 150px;
        }
        .add_description_field {
            flex-grow: 5;
        }
        .item {
            margin: 2px 5px;
        }
        .header {
            background-color: var(--theme-accentFillSelected);
            color: var(--theme-white);
        }
        dwengo-deletable-list-element:nth-child(odd){
            background-color: var(--theme-neutralFillRest);
        }
        
    `
}

export default Classes