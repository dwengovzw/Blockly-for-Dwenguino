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




@customElement("dwengo-classes-page")
class Classes extends connect(store)(LitElement) {

    @state() groups: ClassGroupInfo[] = []
    @state() loading: boolean = false;

    @state() newClassName: string = ""
    @state() newClassDescription: string = ""

    private router = new Routes(this, []);

    stateChanged(state: any): void {
        console.log(state)
        this.groups = structuredClone(state.classGroup.groups)
        this.loading = state.loading
    }

    constructor(){
        super();
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
    }

    handleShowClassGroup(uuid) {
        //this.router.goto(`/dashboard/class/${uuid}`)
       window.location.href=`/dashboard/class/${uuid}`;
    }
    
    protected render() {
        return html`
            ${getGoogleMateriaIconsLinkTag()}
            <dwengo-classes-list-element class="header"
                name="${msg("Name")}"
                description="${msg("Description")}"
                sharingCode="${msg("Sharing Code")}"
                header="true">
            </dwengo-classes-list-element>
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
        dwengo-classes-list-element:nth-child(odd){
            background-color: var(--theme-neutralFillRest);
        }
    `
}

export default Classes