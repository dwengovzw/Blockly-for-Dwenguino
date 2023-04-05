/**
 * @author Tom Neutens <tomneutens@gmail.com>
 */

import { LitElement, css, html, CSSResultGroup } from "lit";
import {customElement, property, state} from 'lit/decorators.js';
import { store } from "../../state/store"
import { msg } from '@lit/localize';
import { connect } from "pwa-helpers"
import { getGoogleMateriaIconsLinkTag } from "../../util"
import {getClassGroup, ClassGroupInfo, getAllClassGroups, approveStudent, deleteStudent} from "../../state/features/class_group_slice"
import { setNotificationMessage, NotificationMessageType } from "../../state/features/notification_slice"
import { Routes } from "@lit-labs/router"

import '@vaadin/button';
import '@vaadin/tabs'
import '@vaadin/grid';
import { columnBodyRenderer } from '@vaadin/grid/lit.js';
import "@material/mwc-button"
import '@vaadin/grid/vaadin-grid-sort-column.js';
import "@material/mwc-dialog"
import { UserInfo } from "../../state/features/user_slice";
import "../user/public_profile"



@customElement("dwengo-class-page")
class Class extends connect(store)(LitElement) {

    @property() uuid: string | null = null
    @state() classGroup: ClassGroupInfo | null = null
    @state() showConfirmDialog: boolean = false

    private itemSelectedToDelete: UserInfo | null = null
    private owner: boolean = false
    

    private _routes = new Routes(this, [
        {path: '', render: () => this.renderDetailsPage()},
        {path: '/user/:uuid', render: ({uuid}) => html`<dwengo-public-profile-page uuid=${uuid}></dwengo-public-profile-page>`},
      ]);

    stateChanged(state: any): void {
        console.log(state)
        if (state.classGroup.currentGroup){
            this.classGroup = structuredClone(state.classGroup.currentGroup)
        }
    }

    constructor(){
        super();
    }

    connectedCallback() {
        super.connectedCallback()
        if (this.uuid){
            store.dispatch(getClassGroup(this.uuid))
        }
    }

    handleDeleteOwner(ownerUuid){
        if (!this.uuid){
            store.dispatch(setNotificationMessage(msg("The uuid of this classgroup is unknown."), NotificationMessageType.ERROR, 2500))
            return
        } else {
            let owners = store.getState().classGroup.currentGroup?.ownedBy
            if (owners && owners.length > 1){
                //store.dispatch(deleteOwner(this.uuid, ownerUuid))
            } else {
                store.dispatch(setNotificationMessage(msg("Cannot remove last owner."), NotificationMessageType.ERROR, 2500))
            }   
        }
        this.showConfirmDialog = false
    }

    handleDeleteStudent(studentUuid){
        if (!this.uuid){
            store.dispatch(setNotificationMessage(msg("The uuid of this classgroup is unknown."), NotificationMessageType.ERROR, 2500))
            return
        } else {
            store.dispatch(deleteStudent(this.uuid, studentUuid))
        }
        this.showConfirmDialog = false
    }

    handleApproveStudent(studentUuid: string, approve: boolean){
        if (!this.uuid){
            store.dispatch(setNotificationMessage(msg("The uuid of this classgroup is unknown."), NotificationMessageType.ERROR, 2500))
            return
        }
        store.dispatch(approveStudent(this.uuid, studentUuid, approve))
    }

    renderOwnersList() {
        return html`
        <vaadin-grid .items="${this.classGroup?.ownedBy}">
                <vaadin-grid-sort-column frozen header="${msg("Firstname")}" auto-width flex-grow="0" path="firstname"></vaadin-grid-sort-column>
                <vaadin-grid-sort-column frozen header="${msg("Lastname")}" auto-width flex-grow="0" path="lastname"></vaadin-grid-sort-column>
                <vaadin-grid-sort-column flex-grow="1" header="${msg("UUID")}" path="uuid" auto-width></vaadin-grid-sort-column>
                <vaadin-grid-column
                    header="${msg("Delete")}"
                    frozen-to-end
                    auto-width
                    flex-grow="0"
                    ${columnBodyRenderer(
                        (user: UserInfo) => html`
                            <vaadin-button 
                                theme="primary" 
                                class="item" 
                                @click="${() => {
                                    this.itemSelectedToDelete = user; 
                                    this.showConfirmDialog = true;
                                    this.owner = true;
                                }
                                }">
                                <span class="material-symbols-outlined">
                                    delete
                                </span>
                            </vaadin-button>`,
                        []
                    )}>
                </vaadin-grid-column>
                <vaadin-grid-column
                header="${msg("Info")}"
                frozen-to-end
                auto-width
                flex-grow="0"
                ${columnBodyRenderer(
                    (user: UserInfo) => html`
                        <a href="${globalSettings.hostname}/dashboard/classes/class/${this.uuid}/info/user/${user.uuid}">
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
            </vaadin-grid>`
    }

    renderStudentsList() {
        return html`
        <vaadin-grid .items="${this.classGroup?.students}">
                <vaadin-grid-sort-column frozen header="${msg("Firstname")}" auto-width flex-grow="0" path="firstname"></vaadin-grid-sort-column>
                <vaadin-grid-sort-column frozen header="${msg("Lastname")}" auto-width flex-grow="0" path="lastname"></vaadin-grid-sort-column>
                <vaadin-grid-sort-column flex-grow="1" header="${msg("UUID")}" path="uuid" auto-width></vaadin-grid-sort-column>
                <vaadin-grid-column
                    header="${msg("Delete")}"
                    frozen-to-end
                    auto-width
                    flex-grow="0"
                    ${columnBodyRenderer(
                        (user: UserInfo) => html`
                            <vaadin-button 
                                theme="primary" 
                                class="item" 
                                @click="${() => 
                                        {
                                            this.itemSelectedToDelete = user; 
                                            this.showConfirmDialog = true;
                                            this.owner = false;
                                        }
                                    }"
                                >
                                <span class="material-symbols-outlined">
                                    delete
                                </span>
                            </vaadin-button>`,
                        []
                    )}>
                </vaadin-grid-column>
                <vaadin-grid-column
                header="${msg("Info")}"
                frozen-to-end
                auto-width
                flex-grow="0"
                ${columnBodyRenderer(
                    (user: UserInfo) => html`
                        <a href="${globalSettings.hostname}/dashboard/classes/class/${this.uuid}/info/user/${user.uuid}">
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
            </vaadin-grid>`
    }

    renderPendingList() {
        return html`
        <vaadin-grid .items="${this.classGroup?.awaitingStudents}">
                <vaadin-grid-sort-column frozen header="${msg("Firstname")}" auto-width flex-grow="0" path="firstname"></vaadin-grid-sort-column>
                <vaadin-grid-sort-column frozen header="${msg("Lastname")}" auto-width flex-grow="0" path="lastname"></vaadin-grid-sort-column>
                <vaadin-grid-sort-column flex-grow="1" header="${msg("UUID")}" path="uuid" auto-width></vaadin-grid-sort-column>
                <vaadin-grid-column
                    header="${msg("Delete")}"
                    frozen-to-end
                    auto-width
                    flex-grow="0"
                    ${columnBodyRenderer(
                        (user: UserInfo) => html`
                            <vaadin-button 
                                theme="primary" 
                                class="item" 
                                @click="${() => {user.uuid ? this.handleApproveStudent(user.uuid, false) : console.log("No uuid")}}">
                                <span class="material-symbols-outlined">
                                    delete
                                </span>
                            </vaadin-button>`,
                        []
                    )}>
                </vaadin-grid-column>
                <vaadin-grid-column
                header="${msg("Approve")}"
                frozen-to-end
                auto-width
                flex-grow="0"
                ${columnBodyRenderer(
                    (user: UserInfo) => html`
                            <vaadin-button 
                                @click="${() => {user.uuid ? this.handleApproveStudent(user.uuid, true) : console.log("No uuid")}}"
                                theme="primary" 
                                class="item">
                                <span class="material-symbols-outlined">
                                    done
                                </span>
                            </vaadin-button>
                        `,
                    []
                )}
                ></vaadin-grid-column>
            </vaadin-grid>`
    }


    renderConfirmDialog(){
        return html`
        <mwc-dialog open="${this.showConfirmDialog}" @closed=${_ => this.showConfirmDialog = false}>
            <div>
                ${msg("Are you sure you want to remove this ")}${this.owner ? msg("owner") : msg("student")}?
            </div>
            <mwc-button @click="${() => {this.owner ? this.handleDeleteOwner(this.itemSelectedToDelete?.uuid) : this.handleDeleteStudent(this.itemSelectedToDelete?.uuid)}}" slot="primaryAction" dialogAction="close">
                ${msg("Yes")}
            </mwc-button>
            <mwc-button @click="${() => {this.showConfirmDialog = false}}" slot="secondaryAction" dialogAction="close">
                ${msg("Cancel")}
            </mwc-button>
        </mwc-dialog>
        `
    }

    renderDetailsPage() {
        return html`${getGoogleMateriaIconsLinkTag()}
                <div tab="details-tab">
                    <h1>${this.classGroup?.name}</h1>
                    <p>${this.classGroup?.description}</p>
                    <h2>${msg("Sharing code")}</h2>
                    <p>${this.classGroup?.sharingCode}</p>
                    <h2>${msg("Owners")}</h2>
                    ${this.renderOwnersList()}
                    <h2>${msg("Students")}</h2>
                    ${this.renderStudentsList()}
                    <h2>${msg("Awaiting students")}</h2>
                    ${this.renderPendingList()}
            ${this.showConfirmDialog ? this.renderConfirmDialog() : ""}
    `
    }

    protected render() {
        return this._routes.outlet()
    }

    static styles?: CSSResultGroup = css`
    `
}

export default Class