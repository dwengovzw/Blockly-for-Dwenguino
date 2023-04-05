/**
 * @author Tom Neutens <tomneutens@gmail.com>
 */

import { LitElement, css, html, CSSResultGroup } from "lit";
import {customElement, state} from 'lit/decorators.js';
import { store } from "../../state/store"
import { msg } from '@lit/localize';
import { connect } from "pwa-helpers"
import { getGoogleMateriaIconsLinkTag } from "../../util"
import { Router, Routes } from "@lit-labs/router"
import { leaveClassGroup, getAllStudentClassGroups, joinClassGroup, StudentClassGroupInfo } from "../../state/features/student_class_group_slice"

import "../menu"
import "@material/mwc-textfield"
import "@material/mwc-button"
import "@material/mwc-checkbox"
import "@material/mwc-formfield"
import "@material/mwc-icon"
import "@material/mwc-circular-progress"
import "../util/deletable_list_item"
import '@vaadin/text-field';


import '@vaadin/button';
import '@vaadin/grid';
import { columnBodyRenderer } from '@vaadin/grid/lit.js';
import "@material/mwc-button"
import '@vaadin/grid/vaadin-grid-sort-column.js';
import "@material/mwc-dialog"


@customElement("dwengo-student-classes-page")
class StudentClasses extends connect(store)(LitElement) {

    @state() groups: StudentClassGroupInfo[] = []
    @state() pending: StudentClassGroupInfo[] = []
    @state() showJoinClassDialog: boolean = false
    @state() showConfirmDialog: boolean = false
    @state() itemSelectedToDelete: StudentClassGroupInfo | null = null
    
    private enteredSharingCode: string = ""

    private router = new Routes(this, []);

    stateChanged(state: any): void {
        console.log(state)
        this.groups = structuredClone(state.studentClassGroup.groups)
        this.pending = structuredClone(state.studentClassGroup.pending)
    }

    constructor(){
        super()
        store.dispatch(getAllStudentClassGroups())
    }

    handleJoinClassGroup(){
        store.dispatch(joinClassGroup(this.enteredSharingCode))
        this.showJoinClassDialog = false
    }

    handleLeaveClassGroup(uuid){
        store.dispatch(leaveClassGroup(uuid))
    }

    handleShowClassGroup(uuid) {
       window.location.href= `${globalSettings.hostname}/dashboard/class/${uuid}`
    }

    renderJoinClassGroupDialog(){
        return html`
        <mwc-dialog open="${this.showJoinClassDialog}" @closed=${_ => this.showJoinClassDialog = false}>
            <div>
                ${msg("Enter the code your teacher shared with you.")}
            </div>
            <vaadin-text-field
                label="${msg("Sharing code")}"
                helper-text="${"Must be 8 characters"}"
                minlength="8"
                maxlength="8"
                @change=${(e) => this.enteredSharingCode = e.target.value}
            ></vaadin-text-field>
            <mwc-button @click="${() => {this.handleJoinClassGroup()}}" slot="primaryAction" dialogAction="close">
                ${msg("Join")}
            </mwc-button>
            <mwc-button @click="${() => {this.showJoinClassDialog = false}}" slot="secondaryAction" dialogAction="close">
                ${msg("Cancel")}
            </mwc-button>
        </mwc-dialog>
        `
    }

    renderConfirmDialog(name: string | undefined, uuid: string | undefined){
        return html`
        <mwc-dialog open="${this.showConfirmDialog}" @closed=${_ => this.showConfirmDialog = false}>
            <div>
                ${msg("Are you sure you want to leave this classgroup: ")}<em>${name}</em>?
            </div>
            <mwc-button @click="${() => {this.handleLeaveClassGroup(uuid)}}" slot="primaryAction" dialogAction="close">
                ${msg("Yes")}
            </mwc-button>
            <mwc-button @click="${() => {this.showConfirmDialog = false}}" slot="secondaryAction" dialogAction="close">
                ${msg("Cancel")}
            </mwc-button>
        </mwc-dialog>
        `
    }

    renderClassGroupList(list: StudentClassGroupInfo[]){
        return html`
            <vaadin-grid .items="${list}">
                <vaadin-grid-sort-column frozen header="${msg("Name")}" auto-width flex-grow="0" path="name">
                </vaadin-grid-sort-column>
                <vaadin-grid-sort-column flex-grow="1" header="${msg("Description")}" path="description" auto-width></vaadin-grid-sort-column>
                <vaadin-grid-column
                frozen-to-end
                auto-width
                flex-grow="0"
                ${columnBodyRenderer(
                    (classGroup: StudentClassGroupInfo) => html`
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
            </vaadin-grid>`
    }
    
    protected render() {
        return html`
            ${getGoogleMateriaIconsLinkTag()}
            <div class="join_classgroup_button">
                <vaadin-button theme="primary" @click=${() => {this.showJoinClassDialog = true}}>${msg("Join class")}</vaadin-button>
            </div>
            <div class="classes_list your_classes_list">
                <h1>${msg("Your classes")}</h1>
                ${this.renderClassGroupList(this.groups)}
            </div>
            <div class="classes_list pending_classes_list">
                <h1>${msg("Classes awaiting approval")}</h1>
                ${this.renderClassGroupList(this.pending)}
            </div>
            
            ${this.showJoinClassDialog ? this.renderJoinClassGroupDialog() : ""}
            ${this.showConfirmDialog ? this.renderConfirmDialog(this.itemSelectedToDelete?.name, this.itemSelectedToDelete?.uuid) : ""}
        `
    }

    static styles?: CSSResultGroup = css`
        mwc-button {
            --mdc-theme-primary: var(--theme-accentFillSelected);
        }
        .classes_list {
            max-width: 100%;
        }
        .join_classgroup_button {
            box-sizing: border-box;
            width: 100%;
            display: flex;
            flex-direction: row;
            justify-content: flex-end;
        }
    `
}

export default StudentClasses